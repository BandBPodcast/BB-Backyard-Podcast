(()=>{
  const cfg=window.BB_LIVE_CONFIG||{};
  const host=location.hostname||'bandbpodcast.github.io';
  const ytVideo=String(cfg.youtubeVideoId||'').trim();
  const twitchChannel=String(cfg.twitchChannel||'').trim();
  const facebookLiveUrl=String(cfg.facebookLiveUrl||'').trim();
  const player=document.getElementById('mainLivePlayer');
  const setup=document.getElementById('mainLiveSetup');
  const tag=document.getElementById('mainPlatformTag');

  const showFrame=(el,src)=>{if(!el)return;el.src=src;el.hidden=false};
  const hideSetup=()=>{if(setup)setup.hidden=true};

  // Keep ONE main livestream player above both chats.
  // Prefer YouTube when configured; otherwise use Twitch.
  if(ytVideo){
    showFrame(player,`https://www.youtube.com/embed/${encodeURIComponent(ytVideo)}?rel=0&autoplay=0`);
    hideSetup();
    if(tag){tag.textContent='YOUTUBE LIVE';tag.className='platform-tag platform-youtube'}
  }else if(twitchChannel){
    showFrame(player,`https://player.twitch.tv/?channel=${encodeURIComponent(twitchChannel)}&parent=${encodeURIComponent(host)}&autoplay=false`);
    hideSetup();
    if(tag){tag.textContent='TWITCH LIVE';tag.className='platform-tag platform-twitch'}
  }

  // v1.4.56: one unified Restream chat panel replaces the separate website chat boxes.
  // Restream's embed is a combined message display; viewers still authenticate/chat on the source platform.
  const restreamChat=document.getElementById('restreamChat');
  const restreamChatSetup=document.getElementById('restreamChatSetup');
  const restreamChatUrl=(cfg.restreamChatEmbedUrl||'').trim();
  if(restreamChatUrl&&restreamChat){
    try{
      const u=new URL(restreamChatUrl);
      if(u.protocol==='https:'&&/(^|\.)restream\.io$/i.test(u.hostname)){
        showFrame(restreamChat,u.href);
        if(restreamChatSetup)restreamChatSetup.hidden=true;
      }
    }catch(e){ console.warn('Invalid Restream chat embed URL.'); }
  }

  // Theatre mode / lights-out focus works on desktop and mobile, with a smooth dimmer fade.
  const theatreBtn=document.getElementById('theatreToggle');
  const theatreDimmer=document.createElement('div');
  theatreDimmer.className='theatre-dimmer';
  theatreDimmer.setAttribute('aria-hidden','true');
  document.body.appendChild(theatreDimmer);
  function setTheatre(on){
    theatreDimmer.classList.toggle('active',on);
    document.body.classList.toggle('live-theatre-mode',on);
    theatreBtn?.setAttribute('aria-pressed',String(on));
    if(theatreBtn) theatreBtn.textContent=on?'✕ Exit Theatre Mode':'◐ Theatre Mode';
  }
  theatreBtn?.addEventListener('click',()=>setTheatre(!document.body.classList.contains('live-theatre-mode')));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('live-theatre-mode'))setTheatre(false)});

  // Country live-status board. social-sync.js updates it from the generated YouTube/Twitch feed.
  const sign=document.getElementById('liveNeonSign');
  const signText=document.getElementById('liveNeonText');
  const signSub=document.getElementById('liveNeonSubtext');
  const signFrame=document.getElementById('liveCountryFrame');
  const frameOff='assets/images/live-status-western-frame-off.png';
  const frameOn='assets/images/live-status-western-frame-on.png';
  window.bbSetLiveState=(isLive,title,url)=>{
    if(!sign)return;
    sign.classList.remove('is-checking','is-off','is-live','igniting');
    if(isLive){
      if(signFrame)signFrame.src=frameOn;
      sign.classList.add('igniting');
      if(signText)signText.textContent='CURRENTLY LIVE';
      if(signSub)signSub.textContent=title||'The backyard is live right now — pull up a chair.';
      setTimeout(()=>{sign.classList.remove('igniting');sign.classList.add('is-live')},380);
      const btn=document.querySelector('[data-live-btn]');
      if(btn){btn.textContent='Watch Live';btn.href=url||'#mainLiveStream'}
    }else{
      if(signFrame)signFrame.src=frameOff;
      sign.classList.add('is-off');
      if(signText)signText.textContent='CURRENTLY OFF AIR';
      if(signSub)signSub.textContent='No B&B broadcast is live right now. This board updates automatically when YouTube or Twitch goes live.';
      const btn=document.querySelector('[data-live-btn]');
      if(btn){btn.textContent='Watch / Follow';btn.href='#mainLiveStream'}
    }
  };
  // Keep a neutral checking state until social-sync.js returns the current feed.
  if(sign){sign.classList.remove('is-off','is-live');sign.classList.add('is-checking');if(signFrame)signFrame.src=frameOff;}

  // Test button makes the sign ignite without changing any real live status.
  const testBtn=document.getElementById('testLiveSign');
  let testOn=false;
  testBtn?.addEventListener('click',()=>{
    testOn=!testOn;
    window.bbSetLiveState(testOn,testOn?'Test signal: B&B is live!':'');
    testBtn.textContent=testOn?'Reset Live Status':'Test Live Status';
  });
})();

/* v1.4.55: social-sync.js calls this when GitHub Actions detects a live broadcast. */
window.bbApplyDetectedLive=(live)=>{
  if(!live?.isLive)return;
  const host=location.hostname||'bandbpodcast.github.io';
  const player=document.getElementById('mainLivePlayer');
  const setup=document.getElementById('mainLiveSetup');
  const tag=document.getElementById('mainPlatformTag');
  if(live.platform==='youtube'&&live.videoId){
    if(player){player.src=`https://www.youtube.com/embed/${encodeURIComponent(live.videoId)}?rel=0&autoplay=0`;player.hidden=false}
    if(setup)setup.hidden=true;
    if(tag){tag.textContent='YOUTUBE LIVE';tag.className='platform-tag platform-youtube'}
  }else if(live.platform==='twitch'){
    const channel=(window.BB_LIVE_CONFIG?.twitchChannel||'bandbpodcast').trim();
    if(player){player.src=`https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${encodeURIComponent(host)}&autoplay=false`;player.hidden=false}
    if(setup)setup.hidden=true;
    if(tag){tag.textContent='TWITCH LIVE';tag.className='platform-tag platform-twitch'}
  }
};
