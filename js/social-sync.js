/* B&B v1.4.55 automatic YouTube + Twitch social feed.
   data/social-feed.json is refreshed by .github/workflows/social-sync.yml. */
const FEED_ENDPOINT = 'data/social-feed.json';
const POLL_MS = 60000;
const seenKey='bb-seen-social-items';
let seen=new Set(JSON.parse(localStorage.getItem(seenKey)||'[]'));

function updateLatestYouTube(item){
  if(!item)return;
  document.querySelectorAll('[data-latest-youtube]').forEach(card=>{
    const img=card.querySelector('[data-latest-youtube-image]');
    const title=card.querySelector('[data-latest-youtube-title]');
    const desc=card.querySelector('[data-latest-youtube-description]');
    const link=card.querySelector('[data-latest-youtube-link]');
    const date=card.querySelector('[data-latest-youtube-date]');
    if(img&&item.thumbnail){img.src=item.thumbnail;img.alt=item.title||'Latest B&B YouTube video'}
    if(title)title.textContent=item.title||'Latest B&B video';
    if(desc)desc.textContent=item.message||'Watch the latest B&B Backyard Podcast video on YouTube.';
    if(link){link.href=item.url||'https://www.youtube.com/@BnBEntertains';link.target='_blank';link.rel='noopener noreferrer'}
    if(date&&item.publishedAt)date.textContent=new Date(item.publishedAt).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
  });
}

function updateLive(data){
  const live=data?.live||{};
  const liveDot=document.querySelector('[data-live-dot]'), liveText=document.querySelector('[data-live-text]'), liveBtn=document.querySelector('[data-live-btn]');
  if(live.isLive){
    liveDot?.classList.add('live');
    if(liveText)liveText.textContent=live.title||'B&B is live now';
    if(liveBtn){liveBtn.textContent='Watch Live';liveBtn.href=live.url||'live.html'}
    window.bbSetLiveState?.(true,live.title||'B&B is live now',live.url||'#mainLiveStream');
    window.bbApplyDetectedLive?.(live);
  }else{
    liveDot?.classList.remove('live');
    window.bbSetLiveState?.(false);
    window.bbApplyDetectedLive?.({isLive:false});
  }
}

async function pollFeed(){
  try{
    const res=await fetch(`${FEED_ENDPOINT}?v=${Date.now()}`,{cache:'no-store'}); if(!res.ok)return;
    const data=await res.json();
    updateLatestYouTube(data.latestYouTube);
    updateLive(data);
    updateClipsPage(data);
    updateEpisodesPage(data);
    const items=Array.isArray(data.items)?data.items:[];
    // First visit establishes a baseline instead of firing old-content toasts.
    if(!localStorage.getItem(seenKey)){
      items.forEach(item=>item.id&&seen.add(item.id));
    }else{
      for(const item of [...items].sort((a,b)=>new Date(a.publishedAt)-new Date(b.publishedAt))){
        if(!item.id||seen.has(item.id))continue;
        seen.add(item.id);
        window.bbToast?.(`NEW ${String(item.platform||'B&B').toUpperCase()} ${String(item.type||'POST').toUpperCase()}`,item.title||item.message||'New B&B content is available.',item.url||'#');
      }
    }
    localStorage.setItem(seenKey,JSON.stringify([...seen].slice(-100)));
  }catch(e){console.debug('B&B social feed unavailable',e)}
}
pollFeed(); setInterval(pollFeed,POLL_MS);

/* v1.4.62: Clips page is populated from the same GitHub-generated social feed. */
function updateClipsPage(data){
  const grid=document.querySelector('[data-synced-clips]');
  if(!grid)return;
  const status=document.getElementById('clipsSyncStatus');
  const items=(Array.isArray(data?.items)?data.items:[])
    .filter(item=>item&&item.url&&item.type!=='live'&&['youtube','twitch','tiktok','facebook'].includes(String(item.platform||'').toLowerCase()))
    .slice(0,12);
  if(!items.length){
    grid.innerHTML='<article class="card"><div class="card-pad"><h3>No synced clips yet</h3><p>New supported videos and clips will appear here automatically after the social sync finds them.</p></div></article>';
    if(status)status.textContent='Waiting for new clips from the connected B&B channels.';
    return;
  }
  grid.innerHTML='';
  for(const item of items){
    const card=document.createElement('article'); card.className='card synced-clip-card';
    const platform=String(item.platform||'B&B');
    const date=item.publishedAt?new Date(item.publishedAt).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'';
    const thumb=item.thumbnail?`<img src="${escapeHtml(item.thumbnail)}" alt="" loading="lazy">`:'';
    card.innerHTML=`<a class="media-thumb" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${thumb}<span class="play">▶</span></a><div class="card-pad"><div class="meta"><span>${escapeHtml(platform.toUpperCase())}</span><span>•</span><span>${escapeHtml(item.type==='clip'?'Clip':'Video')}</span>${date?`<span>•</span><span>${escapeHtml(date)}</span>`:''}</div><h3>${escapeHtml(item.title||'B&B clip')}</h3><p>${escapeHtml((item.message||'Watch this B&B Backyard Podcast moment.').slice(0,180))}</p><a class="btn btn-ghost clip-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Watch ${escapeHtml(platform)}</a></div>`;
    grid.appendChild(card);
  }
  if(status)status.textContent=`Showing the ${items.length} newest synced B&B video${items.length===1?'':'s'} and clip${items.length===1?'':'s'}.`;
}
function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}


/* v1.4.63: Episodes page shows completed full YouTube livestream archives automatically. */
function updateEpisodesPage(data){
  const grid=document.querySelector('[data-synced-episodes]');
  if(!grid)return;
  const status=document.getElementById('episodesSyncStatus');
  const episodes=(Array.isArray(data?.episodes)?data.episodes:[])
    .filter(item=>item&&item.platform==='youtube'&&item.videoId&&item.actualEndTime)
    .sort((a,b)=>new Date(b.actualEndTime||b.publishedAt)-new Date(a.actualEndTime||a.publishedAt));
  if(!episodes.length){
    grid.innerHTML='<article class="card"><div class="card-pad"><h3>No finished livestream episodes yet</h3><p>After a B&amp;B YouTube livestream ends and YouTube finishes the archive, the full broadcast will appear here automatically.</p></div></article>';
    if(status)status.textContent='Waiting for a completed B&B YouTube livestream.';
    return;
  }
  grid.innerHTML='';
  episodes.forEach((item,index)=>{
    const card=document.createElement('article'); card.className='card episode-card synced-episode-card';
    const date=new Date(item.actualStartTime||item.publishedAt).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
    const thumb=item.thumbnail?`<img src="${escapeHtml(item.thumbnail)}" alt="${escapeHtml(item.title||'B&B episode')}" loading="lazy">`:'';
    card.innerHTML=`<a class="media-thumb" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${thumb}<span class="play">▶</span></a><div class="card-pad"><div class="meta"><span>Full Livestream</span><span>•</span><span>YouTube</span><span>•</span><span>${escapeHtml(date)}</span></div><h3>${escapeHtml(item.title||`B&B Episode ${episodes.length-index}`)}</h3><p>${escapeHtml((item.message||'Watch the complete B&B Backyard Podcast livestream replay.').slice(0,220))}</p><a class="btn btn-ghost" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Watch Full Episode</a></div>`;
    grid.appendChild(card);
  });
  if(status)status.textContent=`Showing ${episodes.length} completed B&B livestream episode${episodes.length===1?'':'s'}. New finished livestreams are added automatically.`;
}
