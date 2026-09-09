(()=>{
  const cfg=window.BB_LIVE_CONFIG||{};
  const host=location.hostname||'bandbpodcast.github.io';
  const ytVideo=String(cfg.youtubeVideoId||'').trim();
  const twitchChannel=String(cfg.twitchChannel||'').trim();
  const player=document.getElementById('mainLivePlayer');
  const setup=document.getElementById('mainLiveSetup');
  const tag=document.getElementById('mainPlatformTag');

  const showFrame=(el,src)=>{if(!el)return;el.src=src;el.hidden=false};
  const hideSetup=()=>{if(setup)setup.hidden=true};

  // Keep ONE main livestream player above both chats.
  // Prefer YouTube when a YouTube live video ID is configured; otherwise use Twitch.
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

  const mobileNotice=document.getElementById('youtubeMobileNotice');
  if(mobileNotice&&matchMedia('(max-width: 760px)').matches) mobileNotice.hidden=false;
})();
