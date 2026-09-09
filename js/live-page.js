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

  const ytChat=document.getElementById('youtubeChat');
  const ytChatSetup=document.getElementById('youtubeChatSetup');
  if(ytVideo&&ytChat){
    showFrame(ytChat,`https://www.youtube.com/live_chat?v=${encodeURIComponent(ytVideo)}&embed_domain=${encodeURIComponent(host)}`);
    if(ytChatSetup)ytChatSetup.hidden=true;
  }

  const twitchChat=document.getElementById('twitchChat');
  const twitchChatSetup=document.getElementById('twitchChatSetup');
  if(twitchChannel&&twitchChat){
    showFrame(twitchChat,`https://www.twitch.tv/embed/${encodeURIComponent(twitchChannel)}/chat?parent=${encodeURIComponent(host)}&darkpopout`);
    if(twitchChatSetup)twitchChatSetup.hidden=true;
  }

  // Facebook does not expose a dependable embeddable Live chat composer for third-party sites.
  // We therefore route viewers to the official public Facebook Live post/comments.
  const fbLink=document.getElementById('facebookLiveLink');
  const fbNote=document.getElementById('facebookSetupNote');
  if(fbLink&&facebookLiveUrl){fbLink.href=facebookLiveUrl;if(fbNote)fbNote.hidden=true}
  else if(fbLink){fbLink.setAttribute('aria-disabled','true');fbLink.addEventListener('click',e=>e.preventDefault())}

  const isMobile=matchMedia('(max-width: 760px)').matches;
  const mobileNotice=document.getElementById('youtubeMobileNotice');
  if(mobileNotice&&isMobile) mobileNotice.hidden=false;

  // YouTube/Facebook switcher on the left. On mobile, prefer Facebook when configured.
  const buttons=[...document.querySelectorAll('[data-chat-switch]')];
  const views=[...document.querySelectorAll('[data-chat-view]')];
  const leftTag=document.getElementById('leftChatPlatformTag');
  const leftTitle=document.getElementById('leftChatTitle');
  const leftNote=document.getElementById('leftChatLoginNote');
  const leftHeader=document.getElementById('leftChatHeader');
  const leftDot=document.getElementById('leftChatDot');
  function selectChat(which){
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.chatSwitch===which));
    views.forEach(v=>{const active=v.dataset.chatView===which;v.classList.toggle('active',active);v.hidden=!active});
    const fb=which==='facebook';
    if(leftTag){leftTag.textContent=fb?'Facebook':'YouTube';leftTag.className='platform-tag '+(fb?'platform-facebook':'platform-youtube')}
    if(leftTitle)leftTitle.textContent=fb?'Facebook Live Comments':'YouTube Live Chat';
    if(leftNote)leftNote.textContent=fb?'Use your Facebook account on the Live post':'Sign in with YouTube to chat';
    if(leftHeader)leftHeader.textContent=fb?'Facebook Live Comments':'YouTube Live Chat';
    if(leftDot)leftDot.classList.toggle('facebook-dot',fb);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>selectChat(b.dataset.chatSwitch)));
  selectChat(isMobile&&facebookLiveUrl?'facebook':'youtube');

  // Theatre mode / lights-out focus works on desktop and mobile.
  const theatreBtn=document.getElementById('theatreToggle');
  function setTheatre(on){
    document.body.classList.toggle('live-theatre-mode',on);
    theatreBtn?.setAttribute('aria-pressed',String(on));
    if(theatreBtn) theatreBtn.textContent=on?'✕ Exit Theatre Mode':'◐ Theatre Mode';
  }
  theatreBtn?.addEventListener('click',()=>setTheatre(!document.body.classList.contains('live-theatre-mode')));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('live-theatre-mode'))setTheatre(false)});

  // Neon status sign. social-sync.js can call window.bbSetLiveState(...) when a backend reports a live stream.
  const sign=document.getElementById('liveNeonSign');
  const signText=document.getElementById('liveNeonText');
  const signSub=document.getElementById('liveNeonSubtext');
  window.bbSetLiveState=(isLive,title,url)=>{
    if(!sign)return;
    sign.classList.remove('is-off','is-live','igniting');
    if(isLive){
      sign.classList.add('igniting');
      if(signText)signText.textContent='CURRENTLY LIVE';
      if(signSub)signSub.textContent=title||'The backyard is live right now — pull up a chair.';
      setTimeout(()=>{sign.classList.remove('igniting');sign.classList.add('is-live')},650);
      const btn=document.querySelector('[data-live-btn]');
      if(btn){btn.textContent='Watch Live';btn.href=url||'#mainLiveStream'}
    }else{
      sign.classList.add('is-off');
      if(signText)signText.textContent='CURRENTLY OFF AIR';
      if(signSub)signSub.textContent='The sign will power on automatically when the podcast goes live.';
      const btn=document.querySelector('[data-live-btn]');
      if(btn){btn.textContent='Watch / Follow';btn.href='#mainLiveStream'}
    }
  };
  window.bbSetLiveState(false);

  // Test button makes the sign ignite without changing any real live status.
  const testBtn=document.getElementById('testLiveSign');
  let testOn=false;
  testBtn?.addEventListener('click',()=>{
    testOn=!testOn;
    window.bbSetLiveState(testOn,testOn?'Test signal: B&B is live!':'');
    testBtn.textContent=testOn?'Reset Live Sign':'Test Live Sign';
  });
})();
