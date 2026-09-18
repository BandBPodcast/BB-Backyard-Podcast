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
