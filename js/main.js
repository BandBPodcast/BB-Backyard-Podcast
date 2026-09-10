const qs=(s,p=document)=>p.querySelector(s), qsa=(s,p=document)=>[...p.querySelectorAll(s)];
const loader=qs('#siteLoader');
const hasSeen=sessionStorage.getItem('bb-loader-seen');

function runBBLoader(){
  if(!loader) return;
  const percentEl=qs('#loaderPercent'), progressEl=qs('#loaderProgress'), messageEl=qs('#loaderMessage');
  loader.classList.add('powering','bb-flash-off');

  // Real image-swap flicker: OFF -> quick electrical teaser -> OFF again.
  // This is driven by classes instead of opacity keyframes so the two supplied
  // transparent PNGs visibly swap even when older loader CSS is present.
  const flickerTimers=[];
  const later=(fn,ms)=>{const id=setTimeout(fn,ms);flickerTimers.push(id);return id};
  const showFlash=(on)=>{
    loader.classList.toggle('bb-flash-on',!!on);
    loader.classList.toggle('bb-flash-off',!on);
  };
  later(()=>showFlash(true),430);
  later(()=>showFlash(false),525);
  later(()=>showFlash(true),590);
  later(()=>showFlash(false),650);

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
      loader.classList.remove('powering','bb-flash-on','bb-flash-off','neon-on');
      if(messageEl) messageEl.textContent='B&B Backyard Podcast — powering on';

      // At 100%, sputter repeatedly between the actual OFF and ON image,
      // then lock the ON sign before fading into the page.
      const sequence=[
        [0,false],[90,true],[165,false],[245,true],[315,false],[385,true],
        [455,false],[535,true],[610,false],[690,true],[775,false],[855,true],
        [935,false],[1015,true],[1090,false],[1170,true]
      ];
      sequence.forEach(([ms,on])=>later(()=>showFlash(on),ms));
      later(()=>{
        loader.classList.remove('bb-flash-on','bb-flash-off');
        loader.classList.add('bb-final-on');
        if(messageEl) messageEl.textContent='B&B Backyard Podcast — powered on';
      },1240);
      later(()=>{
        sessionStorage.setItem('bb-loader-seen','1');
        loader.classList.add('hide');
        document.documentElement.classList.add('bb-first-load-complete');
        setTimeout(()=>document.documentElement.classList.add('loader-seen'),760);
      },1640);
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
  el.className='toast neon-toast toast-off';
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  const safeTitle=String(title||'B&B UPDATE');
  const safeMessage=String(message||'New B&B content is available.');
  el.innerHTML=`<div class="toast-neon-rail" aria-hidden="true"></div><button class="toast-close" type="button" aria-label="Close notification">×</button><div class="toast-kicker">BACKYARD SIGNAL</div><b>${safeTitle}</b><p>${safeMessage}</p>${link?'<a class="toast-action" href="'+link+'">OPEN UPDATE →</a>':''}<div class="toast-timer" aria-hidden="true"><span></span></div>`;
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
  transition.innerHTML='<div class="transition-door transition-door-left"></div><div class="transition-door transition-door-right"></div><div class="transition-seam"></div><div class="transition-sign transition-logo-stack" aria-label="B&B Backyard Podcast"><img class="transition-logo transition-logo-off" src="assets/images/offsignlogo.png" alt="B&B Backyard Podcast sign off"><img class="transition-logo transition-logo-on" src="assets/images/nowalltexturelogo.png" alt="" aria-hidden="true"></div>';
  document.body.appendChild(transition);

  const entering=sessionStorage.getItem('bb-transition-pending')==='1';
  if(entering){
    sessionStorage.removeItem('bb-transition-pending');
    document.documentElement.classList.add('loader-seen','bb-transition-ready');
    document.documentElement.classList.remove('bb-transition-enter');
    transition.classList.add('show','entering','sign-on');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      setTimeout(()=>{transition.classList.remove('entering','sign-on');transition.classList.add('opening')},220);
      setTimeout(()=>{transition.classList.remove('show','opening');},980);
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
    setTimeout(()=>{transition.classList.remove('closing');transition.classList.add('closed','sign-ready')},720);
    setTimeout(()=>transition.classList.add('sign-on'),1040);
    setTimeout(()=>{
      sessionStorage.setItem('bb-loader-seen','1');
      sessionStorage.setItem('bb-transition-pending','1');
      location.href=link.href;
    },1810);
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

// Neon scroll-to-top button. Always visible: no outer glow at the top, cyan as you scroll, fully red at the bottom.
(()=>{
  const btn=document.createElement('button');
  btn.className='bb-scroll-top at-top';
  btn.type='button';
  btn.setAttribute('aria-label','Scroll to top');
  btn.innerHTML='<span aria-hidden="true">↑</span><small>TOP</small>';
  document.body.appendChild(btn);
  const update=()=>{
    const doc=document.documentElement;
    const max=Math.max(1,doc.scrollHeight-innerHeight);
    const p=Math.max(0,Math.min(1,scrollY/max));
    // Hold cyan through most of the page, then blend to full neon red near the bottom.
    const redMix=Math.max(0,Math.min(1,(p-.58)/.42));
    const r=Math.round(67+(255-67)*redMix);
    const g=Math.round(245+(32-245)*redMix);
    const b=Math.round(255+(56-255)*redMix);
    // Outer square begins with no light and powers up smoothly after leaving the top.
    const glow=Math.max(0,Math.min(1,p/.22));
    const borderAlpha=(.10+.78*glow).toFixed(3);
    const innerAlpha=(.04+.48*glow).toFixed(3);
    const glow1=(.18+.46*glow).toFixed(3);
    const glow2=(.06+.34*glow).toFixed(3);
    btn.style.setProperty('--scroll-neon',`rgb(${r} ${g} ${b})`);
    btn.style.setProperty('--scroll-border',p<.012?'transparent':`rgba(${r},${g},${b},${borderAlpha})`);
    btn.style.setProperty('--scroll-inner',p<.012?'transparent':`rgba(${r},${g},${b},${innerAlpha})`);
    btn.style.setProperty('--scroll-inner-glow',p<.012?'transparent':`rgba(${r},${g},${b},${(0.16*glow).toFixed(3)})`);
    btn.style.setProperty('--scroll-glow1',p<.012?'transparent':`rgba(${r},${g},${b},${glow1})`);
    btn.style.setProperty('--scroll-glow2',p<.012?'transparent':`rgba(${r},${g},${b},${glow2})`);
    btn.classList.toggle('at-top',p<.012);
    btn.classList.toggle('at-bottom',p>.97);
  };
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',update,{passive:true});
  update();
  btn.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
})();



// v1.4.4 — navigation neon logo: a brief OFF/ON electrical blink once per minute.
(()=>{
  const brand=document.querySelector('.site-header .brand');
  if(!brand || !brand.querySelector('.nav-logo-stack')) return;

  let sequenceTimers=[];
  const clearSequence=()=>{sequenceTimers.forEach(clearTimeout);sequenceTimers=[]};
  const setState=(state)=>{
    brand.classList.remove('nav-neon-off','nav-neon-flash');
    if(state) brand.classList.add(state);
  };
  const blink=()=>{
    clearSequence();
    // Normally ON. Briefly lose power, spark back, dip once, then remain ON.
    setState('nav-neon-off');
    sequenceTimers.push(setTimeout(()=>setState('nav-neon-flash'),170));
    sequenceTimers.push(setTimeout(()=>setState('nav-neon-off'),290));
    sequenceTimers.push(setTimeout(()=>setState('nav-neon-flash'),390));
    sequenceTimers.push(setTimeout(()=>setState(''),560));
  };

  // Give visitors one subtle blink shortly after the page settles, then once per minute.
  const first=setTimeout(blink,8000);
  const interval=setInterval(blink,60000);
  window.addEventListener('pagehide',()=>{clearTimeout(first);clearInterval(interval);clearSequence()},{once:true});
})();
