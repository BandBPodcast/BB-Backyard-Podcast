import fs from 'node:fs/promises';

const OUT = new URL('../data/social-feed.json', import.meta.url);
const youtubeKey = process.env.YOUTUBE_API_KEY || '';
const youtubeHandle = process.env.YOUTUBE_HANDLE || 'BnBEntertains';
const twitchClientId = process.env.TWITCH_CLIENT_ID || '';
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET || '';
const twitchLogin = process.env.TWITCH_CHANNEL || 'bandbpodcast';

const feed = { generatedAt: new Date().toISOString(), items: [], latestYouTube: null, live: { isLive:false, platform:null, title:null, url:null, videoId:null } };
const getJSON = async (url, options={}) => {
  const r = await fetch(url, options);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}: ${await r.text()}`);
  return r.json();
};

async function syncYouTube(){
  if(!youtubeKey){ console.log('YOUTUBE_API_KEY not configured; skipping YouTube.'); return; }
  const base='https://www.googleapis.com/youtube/v3';
  const channel = await getJSON(`${base}/channels?part=snippet,contentDetails&forHandle=${encodeURIComponent(youtubeHandle)}&key=${encodeURIComponent(youtubeKey)}`);
  const ch=channel.items?.[0];
  if(!ch) throw new Error(`YouTube channel @${youtubeHandle} was not found.`);
  const uploads=ch.contentDetails?.relatedPlaylists?.uploads;
  const playlist=await getJSON(`${base}/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(uploads)}&maxResults=10&key=${encodeURIComponent(youtubeKey)}`);
  const ids=(playlist.items||[]).map(x=>x.contentDetails?.videoId).filter(Boolean);
  if(!ids.length) return;
  const videos=await getJSON(`${base}/videos?part=snippet,liveStreamingDetails&id=${encodeURIComponent(ids.join(','))}&key=${encodeURIComponent(youtubeKey)}`);
  const byId=new Map((videos.items||[]).map(v=>[v.id,v]));
  const items=(playlist.items||[]).map(p=>{
    const id=p.contentDetails?.videoId; const v=byId.get(id); const s=v?.snippet||p.snippet||{};
    return { id:`youtube-${id}`, platform:'youtube', type:s.liveBroadcastContent==='live'?'live':'video', title:s.title||'New B&B video', message:(s.description||'').slice(0,220), url:`https://www.youtube.com/watch?v=${id}`, thumbnail:s.thumbnails?.maxres?.url||s.thumbnails?.high?.url||s.thumbnails?.medium?.url||s.thumbnails?.default?.url||'', publishedAt:p.contentDetails?.videoPublishedAt||s.publishedAt||new Date().toISOString(), videoId:id, liveBroadcastContent:s.liveBroadcastContent||'none' };
  });
  feed.items.push(...items);
  feed.latestYouTube=items.find(x=>x.liveBroadcastContent!=='upcoming')||items[0]||null;
  const live=items.find(x=>x.liveBroadcastContent==='live');
  if(live) feed.live={isLive:true,platform:'youtube',title:live.title,url:live.url,videoId:live.videoId};
}

async function syncTwitch(){
  if(!twitchClientId || !twitchClientSecret){ console.log('Twitch credentials not configured; skipping Twitch.'); return; }
  const body=new URLSearchParams({client_id:twitchClientId,client_secret:twitchClientSecret,grant_type:'client_credentials'});
  const token=await getJSON('https://id.twitch.tv/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
  const streams=await getJSON(`https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(twitchLogin)}`,{headers:{'Client-Id':twitchClientId,'Authorization':`Bearer ${token.access_token}`}});
  const s=streams.data?.[0];
  if(!s) return;
  const item={id:`twitch-live-${s.id}`,platform:'twitch',type:'live',title:s.title||'B&B is live on Twitch',message:s.game_name?`Live in ${s.game_name}`:'B&B is live now.',url:`https://www.twitch.tv/${twitchLogin}`,thumbnail:(s.thumbnail_url||'').replace('{width}','640').replace('{height}','360'),publishedAt:s.started_at||new Date().toISOString()};
  feed.items.unshift(item);
  // YouTube takes priority only if it is actually live; otherwise Twitch becomes the active live source.
  if(!feed.live.isLive) feed.live={isLive:true,platform:'twitch',title:item.title,url:item.url,videoId:null};
}

for (const task of [syncYouTube, syncTwitch]) {
  try { await task(); } catch (e) { console.error(e.message); }
}
feed.items.sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));
feed.items=feed.items.slice(0,20);
await fs.writeFile(OUT, JSON.stringify(feed,null,2)+'\n');
console.log(`Wrote ${feed.items.length} feed item(s). Live: ${feed.live.isLive ? feed.live.platform : 'no'}`);
