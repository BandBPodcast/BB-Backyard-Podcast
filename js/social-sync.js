/*
  B&B social feed watcher.
  GitHub Pages is static, so true cross-platform "instant" social syncing requires a backend/webhook.
  Point FEED_ENDPOINT at a JSON endpoint (Supabase Edge Function, Cloudflare Worker, etc.) that returns:
  { items:[{id,platform,type,title,message,url,publishedAt}], live:{isLive,title,url} }
*/
const FEED_ENDPOINT = ''; // Add your production feed endpoint here.
const POLL_MS = 60000;
const seenKey='bb-seen-social-items';
let seen=new Set(JSON.parse(localStorage.getItem(seenKey)||'[]'));
async function pollFeed(){
  if(!FEED_ENDPOINT)return;
  try{
    const res=await fetch(FEED_ENDPOINT,{cache:'no-store'}); if(!res.ok)return;
    const data=await res.json(); const items=Array.isArray(data.items)?data.items:[];
    for(const item of items.sort((a,b)=>new Date(a.publishedAt)-new Date(b.publishedAt))){
      if(seen.has(item.id))continue;
      seen.add(item.id);
      window.bbToast?.(`NEW ${String(item.platform||'B&B').toUpperCase()} ${String(item.type||'POST').toUpperCase()}`,item.title||item.message||'New B&B content is available.',item.url||'#');
    }
    localStorage.setItem(seenKey,JSON.stringify([...seen].slice(-100)));
    const liveDot=document.querySelector('[data-live-dot]'), liveText=document.querySelector('[data-live-text]'),liveBtn=document.querySelector('[data-live-btn]');
    if(data.live?.isLive){
      liveDot?.classList.add('live');if(liveText)liveText.textContent=data.live.title||'B&B is live now';if(liveBtn){liveBtn.textContent='Watch Live';liveBtn.href=data.live.url||'live.html'}
      window.bbSetLiveState?.(true,data.live.title||'B&B is live now',data.live.url||'#mainLiveStream');
    }else{
      liveDot?.classList.remove('live');window.bbSetLiveState?.(false);
    }
  }catch(e){console.debug('B&B feed endpoint unavailable',e)}
}
pollFeed(); setInterval(pollFeed,POLL_MS);
