const qs=(s,p=document)=>p.querySelector(s), qsa=(s,p=document)=>[...p.querySelectorAll(s)];
const loader=qs('#siteLoader');
const hasSeen=sessionStorage.getItem('bb-loader-seen');

function runBBLoader(){
  if(!loader) return;
  const percentEl=qs('#loaderPercent'), progressEl=qs('#loaderProgress'), messageEl=qs('#loaderMessage');
  loader.classList.add('powering','bb-flash-off');

  // v1.4.5: gentler, photosensitive-friendly image-swap flicker.
  // Keep the OFF transparent sign visible, allow one small teaser flash while loading,
  // then use only a couple of spaced flashes at 100% before staying ON for two seconds.
  const flickerTimers=[];
  const later=(fn,ms)=>{const id=setTimeout(fn,ms);flickerTimers.push(id);return id};
  const showFlash=(on)=>{
    loader.classList.toggle('bb-flash-on',!!on);
    loader.classList.toggle('bb-flash-off',!on);
  };

  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // One subtle teaser only — no rapid strobing while the percentage is moving.
  if(!reduceMotion){
    later(()=>showFlash(true),700);
    later(()=>showFlash(false),880);
  }

  let progress=0;
  const messages=[[0,'Neon circuits warming up'],[28,'Lighting the backyard wall'],[56,'Tuning the podcast signal'],[82,'Powering the B&B sign']];
  const timer=setInterval(()=>{
    const remaining=100-progress;
    const step=remaining>40?Math.ceil(Math.random()*4)+1:remaining>14?Math.ceil(Math.random()*3)+1:1;
    progress=Math.min(100,progress+step);
    if(percentEl) percentEl.textContent=progress+'%';
    if(progressEl) progressEl.style.width=progress+'%';
    for(const [at,text] of messages) if(progress>=at&&messageEl) messageEl.textContent=text;
    if(progress>=100){
      clearInterval(timer);
      flickerTimers.forEach(clearTimeout);
      loader.classList.remove('powering','bb-flash-on','bb-flash-off','neon-on','bb-final-on');
      showFlash(false);
      if(messageEl) messageEl.textContent='B & B Backyard Podcast — bringing the sunset to life';

      // Two deliberate flashes with comfortable spacing, then lock ON.
      const lockOnAt=reduceMotion?180:1380;
      if(!reduceMotion){
        later(()=>showFlash(true),260);
        later(()=>showFlash(false),520);
        later(()=>showFlash(true),820);
        later(()=>showFlash(false),1080);
      }
      later(()=>{
        loader.classList.remove('bb-flash-on','bb-flash-off');
        loader.classList.add('bb-final-on');
        if(messageEl) messageEl.textContent='B & B Backyard Podcast — welcome to the Backyard';
      },lockOnAt);

      // Keep the fully illuminated sign on-screen for a full two seconds.
      later(()=>{
        sessionStorage.setItem('bb-loader-seen','1');
        loader.classList.add('hide');
        document.documentElement.classList.add('bb-first-load-complete');
        setTimeout(()=>document.documentElement.classList.add('loader-seen'),760);
      },lockOnAt+2000);
    }
  },55);
}
if(hasSeen){document.documentElement.classList.add('loader-seen');loader?.classList.add('hide')}else if(document.readyState==='complete')runBBLoader();else window.addEventListener('load',runBBLoader,{once:true});

const menu=qs('#menuBtn'),links=qs('#navLinks');
menu?.addEventListener('click',()=>links?.classList.toggle('open'));
qsa('.nav-link').forEach(a=>a.addEventListener('click',()=>links?.classList.remove('open')));
const path=location.pathname.split('/').pop()||'index.html';
qsa('.nav-link').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active')});
window.bbToast=(title,message,link)=>{
  const stack=qs('#toastStack'); if(!stack)return;
  const duration=9000;
  const el=document.createElement('div');
  el.className='toast neon-toast country-toast toast-off';
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  const safeTitle=String(title||'B&B UPDATE');
  const safeMessage=String(message||'New B&B content is available.');
  el.innerHTML=`<div class="toast-neon-rail" aria-hidden="true"></div><button class="toast-close" type="button" aria-label="Close notification">×</button><div class="toast-kicker">B&amp;B BACKYARD BULLETIN</div><b>${safeTitle}</b><p>${safeMessage}</p>${link?'<a class="toast-action" href="'+link+'">VIEW UPDATE →</a>':''}<div class="toast-timer" aria-hidden="true"><span></span></div>`;
  stack.appendChild(el);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{el.classList.remove('toast-off');el.classList.add('toast-powering')}));
  const ignite=setTimeout(()=>{el.classList.remove('toast-powering');el.classList.add('toast-on')},520);
  const remove=()=>{clearTimeout(ignite);clearTimeout(auto);el.classList.add('toast-out');setTimeout(()=>el.remove(),260)};
  el.querySelector('.toast-close')?.addEventListener('click',remove);
  const auto=setTimeout(remove,duration);
};
qsa('[data-demo-toast]').forEach(btn=>btn.addEventListener('click',()=>window.bbToast('B&B IS LIVE','The Backyard Podcast is live now. Tap to join the stream.','live.html')));
const year=qs('[data-year]');if(year)year.textContent=new Date().getFullYear();

// Atmospheric smoke is decorative only and never blocks interaction.
if(!qs('.site-smoke')){const smoke=document.createElement('div');smoke.className='site-smoke';smoke.setAttribute('aria-hidden','true');document.body.appendChild(smoke)}

// Seamless internal transition. Destination page suppresses the loader before paint,
// restores the closed doors, then opens them so the old loader can never flash between pages.
(()=>{
  const transition=document.createElement('div');
  transition.className='page-transition'; transition.id='pageTransition'; transition.setAttribute('aria-hidden','true');
  transition.innerHTML='<div class="transition-door transition-door-left"></div><div class="transition-door transition-door-right"></div><div class="transition-seam"></div><div class="transition-sign transition-logo-stack" aria-label="B&B Backyard Podcast"><img class="transition-logo transition-logo-off" src="assets/images/bnb-current-logo.png" alt="B&B Backyard Podcast bottle cap"><img class="transition-logo transition-logo-on" src="assets/images/bnb-current-logo.png" alt="" aria-hidden="true"></div>';
  document.body.appendChild(transition);

  const entering=sessionStorage.getItem('bb-transition-pending')==='1';
  if(entering){
    sessionStorage.removeItem('bb-transition-pending');
    document.documentElement.classList.add('loader-seen','bb-transition-ready');
    document.documentElement.classList.remove('bb-transition-enter');
    transition.classList.add('show','entering','sign-on');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      setTimeout(()=>{transition.classList.remove('entering','sign-on');transition.classList.add('opening')},420);
      setTimeout(()=>{transition.classList.remove('show','opening');},1320);
    }));
  }else{
    document.documentElement.classList.add('bb-transition-ready');
    document.documentElement.classList.remove('bb-transition-enter');
  }

  document.addEventListener('click',(event)=>{
    const link=event.target.closest('a[href]'); if(!link)return;
    const href=link.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||link.target==='_blank'||link.hasAttribute('download'))return;
    let url;try{url=new URL(link.href,location.href)}catch{return}
    if(url.origin!==location.origin)return;
    if(url.pathname===location.pathname&&url.hash)return;
    event.preventDefault();
    transition.className='page-transition show closing';
    setTimeout(()=>{transition.classList.remove('closing');transition.classList.add('closed','sign-ready')},620);
    setTimeout(()=>transition.classList.add('sign-on'),1450);
    setTimeout(()=>{
      sessionStorage.setItem('bb-loader-seen','1');
      sessionStorage.setItem('bb-transition-pending','1');
      location.href=link.href;
    },1760);
  });

  window.addEventListener('pageshow',(e)=>{if(e.persisted){transition.className='page-transition';document.documentElement.classList.add('loader-seen','bb-transition-ready');document.documentElement.classList.remove('bb-transition-enter')}});
})();


// ===== B&B v1.3.7 motion polish =====
// Always begin at the top of the current page instead of restoring an old scroll position.
try{history.scrollRestoration='manual'}catch(e){}
const bbResetScroll=()=>window.scrollTo({top:0,left:0,behavior:'auto'});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bbResetScroll,{once:true});else bbResetScroll();
window.addEventListener('pageshow',bbResetScroll);

// Scroll reveal: panels plus ALL main-page text fade in while visible and fade back out when out of view.
(()=>{
  const panelSelector=[
    '.hero-logo','.section .card','.section .notice','.section .actions',
    '.live-neon-status','.main-stream-card','.chat-panel'
  ].join(',');
  const panelItems=[...new Set(qsa(panelSelector))].filter(el=>!el.closest('.page-transition')&&!el.closest('.loader'));
  panelItems.forEach((el,i)=>{
    el.classList.add('bb-reveal');
    el.style.setProperty('--reveal-delay',`${Math.min((i%4)*45,135)}ms`);
  });

  // Text is handled separately so every page gets the same in/out motion, not just whole cards.
  const textSelector='main h1,main h2,main h3,main h4,main h5,main h6,main p,main li,main .eyebrow,main .section-title,main .meta,main label,main blockquote,main .btn';
  const textItems=[...new Set(qsa(textSelector))].filter(el=>!el.closest('.page-transition')&&!el.closest('.loader')&&!el.closest('.toast-stack'));
  textItems.forEach((el,i)=>{
    el.classList.add('bb-text-reveal');
    el.style.setProperty('--reveal-delay',`${Math.min((i%5)*38,152)}ms`);
  });

  const items=[...new Set([...panelItems,...textItems])];
  if(!('IntersectionObserver' in window)){
    items.forEach(el=>el.classList.add('is-visible'));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('is-visible',entry.isIntersecting));
  },{threshold:.06,rootMargin:'2% 0px -4% 0px'});
  items.forEach(el=>observer.observe(el));
})();

// B & B v1.4.28 — pint-glass scroll progress / scroll-to-top control.
// The beer layer sits BEHIND the transparent mug artwork and is clipped to the glass bowl only.
(()=>{
  const btn=document.createElement('button');
  btn.className='bb-scroll-mug at-top';
  btn.type='button';
  btn.setAttribute('aria-label','Scroll to top — page progress');
  btn.innerHTML='<span class="bb-mug-liquid" aria-hidden="true"><img class="bb-beer-fill" src="assets/images/bnb-scroll-beer-fill.png" alt=""></span><img class="bb-mug-art" src="assets/images/bnb-scroll-mug.png" alt="">';
  document.body.appendChild(btn);
  let ticking=false;
  const update=()=>{
    const doc=document.documentElement;
    const max=Math.max(1,doc.scrollHeight-innerHeight);
    const p=Math.max(0,Math.min(1,scrollY/max));
    btn.style.setProperty('--mug-fill',(p*100).toFixed(2)+'%');
    btn.style.setProperty('--mug-progress',p.toFixed(4));
    const liquid=btn.querySelector('.bb-mug-liquid');
    if(liquid) liquid.style.height=(p*89.6).toFixed(2)+'%';
    btn.classList.toggle('at-top',p<.008);
    btn.classList.toggle('at-bottom',p>.985);
    ticking=false;
  };
  const requestUpdate=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
  addEventListener('scroll',requestUpdate,{passive:true});
  addEventListener('resize',requestUpdate,{passive:true});
  update();
  btn.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
})();


// v1.4.8 — new bottle-cap navigation logo: gentle glow pulse without swapping assets.
(()=>{
  const brand=document.querySelector('.site-header .brand');
  if(!brand) return;
  const pulse=()=>{brand.classList.add('nav-bottlecap-pulse');setTimeout(()=>brand.classList.remove('nav-bottlecap-pulse'),900)};
  const first=setTimeout(pulse,5000);
  const interval=setInterval(pulse,60000);
  window.addEventListener('pagehide',()=>{clearTimeout(first);clearInterval(interval)},{once:true});
})();

// Home bottle-cap logo: keep the seamless float and add a restrained glow pulse.
(()=>{
  const hero=document.querySelector('.hero-bottlecap');
  if(!hero) return;
  const pulse=()=>{hero.classList.add('hero-bottlecap-pulse');setTimeout(()=>hero.classList.remove('hero-bottlecap-pulse'),1100)};
  const first=setTimeout(pulse,12000);
  const interval=setInterval(pulse,75000);
  window.addEventListener('pagehide',()=>{clearTimeout(first);clearInterval(interval)},{once:true});
})();


// ===== B&B v1.4.6 crew profile modal =====
(()=>{
  const modal=document.querySelector('#crewModal');
  if(!modal)return;
  const cards=[...document.querySelectorAll('.crew-card-interactive')];
  const nameEl=modal.querySelector('#crewModalName');
  const titleEl=modal.querySelector('#crewModalTitle');
  const descEl=modal.querySelector('#crewModalDescription');
  const photoEl=modal.querySelector('#crewModalPhoto');
  const closeBtn=modal.querySelector('.crew-modal-close');
  let lastFocus=null;

  const syncPhoto=(card)=>{
    const source=card.querySelector('.wanted-portrait, .crew-photo');
    photoEl.innerHTML='';
    const img=source?.querySelector('img');
    if(img){
      const clone=img.cloneNode(true);
      clone.removeAttribute('id');
      // Preserve each crew portrait's card framing inside the profile modal.
      if((img.getAttribute('alt')||'')!=='Ora Johnson') clone.style.objectPosition=getComputedStyle(img).objectPosition;
      photoEl.appendChild(clone);
    }else{
      photoEl.textContent=(source?.textContent||'B&B').trim();
    }
  };
  const open=(card)=>{
    lastFocus=document.activeElement;
    nameEl.textContent=card.dataset.crewName||card.querySelector('h3')?.textContent||'Crew Member';
    titleEl.textContent=card.dataset.crewTitle||card.querySelector('.eyebrow')?.textContent||'Host / Co-Host';
    descEl.textContent=card.dataset.crewDescription||card.querySelector('p')?.textContent||'';
    syncPhoto(card);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('crew-modal-open');
    requestAnimationFrame(()=>closeBtn?.focus());
  };
  const close=()=>{
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('crew-modal-open');
    if(lastFocus&&typeof lastFocus.focus==='function')lastFocus.focus();
  };
  cards.forEach(card=>{
    card.addEventListener('click',()=>open(card));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(card)}});
  });
  modal.querySelectorAll('[data-crew-close]').forEach(el=>el.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))close()});
})();

// B & B v1.4.27 — chain-hung sign: subtle forward/back porch-sign motion + mouse response.
(()=>{
  const wrap=document.createElement('div');
  wrap.className='bb-hanging-sign';
  wrap.setAttribute('aria-hidden','true');
  wrap.innerHTML='<img class="bb-hanging-post" src="assets/images/hanging-sign-post.png" alt=""><div class="bb-sign-pivot"><img class="bb-hanging-board" src="assets/images/hanging-bnb-sign.png" alt=""></div>';
  document.body.appendChild(wrap);
  const pivot=wrap.querySelector('.bb-sign-pivot');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||innerWidth<=480)return;

  let mousePitch=0, mouseLift=0;
  let lastMove=0;
  addEventListener('pointermove',e=>{
    const r=wrap.getBoundingClientRect();
    const cx=r.left+r.width*.63, cy=r.top+r.height*.39;
    const dx=e.clientX-cx, dy=e.clientY-cy;
    const dist=Math.hypot(dx,dy);
    if(dist<520){
      const proximity=1-dist/520;
      // Vertical pointer movement pushes the board toward/away from the viewer.
      mousePitch=Math.max(-9,Math.min(9,(dy/230)*9))*proximity;
      mouseLift=Math.max(-4,Math.min(4,(-dy/270)*4))*proximity;
      lastMove=performance.now();
    }
  },{passive:true});

  const started=performance.now();
  const animate=now=>{
    // Slow natural front/back movement, like a heavy weathered sign in a light breeze.
    const t=(now-started)/1000;
    const gust=(Math.sin(t*.19)+1)*.5;
    const idlePitch=Math.sin(t*.88)*3.1 + Math.sin(t*.37)*1.25 + Math.sin(t*1.73)*(.65+gust*.8);
    const idleLift=Math.sin(t*.88+.7)*1.35 + Math.sin(t*.29)*.55;
    const stale=Math.min(1,Math.max(0,(now-lastMove-250)/1500));
    mousePitch*=.965;
    mouseLift*=.965;
    const pitch=idlePitch+mousePitch*(1-stale);
    const lift=idleLift+mouseLift*(1-stale);
    pivot.style.setProperty('--sign-pitch',pitch.toFixed(2)+'deg');
    pivot.style.setProperty('--sign-y',lift.toFixed(2)+'px');
    pivot.style.setProperty('--sign-shadow-y',(10+Math.abs(pitch)*.7).toFixed(1)+'px');
    pivot.style.setProperty('--sign-shadow-blur',(9+Math.abs(pitch)*.45).toFixed(1)+'px');
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
})();

// B & B v1.4.44 — tumbleweed rolls/bounces across the footer once every minute.
(()=>{
  const footer=document.querySelector('.footer');
  if(!footer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const track=document.createElement('div');
  track.className='bb-footer-tumbleweed-track';
  track.setAttribute('aria-hidden','true');
  const weed=document.createElement('img');
  weed.className='bb-footer-tumbleweed';
  weed.src='assets/images/tumbleweed.png';
  weed.alt='';
  track.appendChild(weed);
  footer.appendChild(track);

  const roll=()=>{
    weed.classList.remove('is-rolling');
    void weed.offsetWidth;
    weed.classList.add('is-rolling');
  };
  // Give the page a moment to settle, then roll; repeat every 60 seconds.
  const first=setTimeout(roll,1800);
  const timer=setInterval(roll,60000);
  window.addEventListener('pagehide',()=>{clearTimeout(first);clearInterval(timer)},{once:true});
})();
