const qs=(s,p=document)=>p.querySelector(s), qsa=(s,p=document)=>[...p.querySelectorAll(s)];
const loader=qs('#siteLoader');
const hasSeen=sessionStorage.getItem('bb-loader-seen');

function runBBLoader(){
  if(!loader) return;
  const percentEl=qs('#loaderPercent'), progressEl=qs('#loaderProgress'), messageEl=qs('#loaderMessage');
  loader.classList.add('powering');
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
      clearInterval(timer); loader.classList.remove('powering'); loader.classList.add('neon-on');
      if(messageEl) messageEl.textContent='B&B Backyard Podcast — powered on';
      setTimeout(()=>{
        sessionStorage.setItem('bb-loader-seen','1');
        // Fade the loader away first so the page is revealed smoothly.
        loader.classList.add('hide');
        document.documentElement.classList.add('bb-first-load-complete');
        setTimeout(()=>document.documentElement.classList.add('loader-seen'),760);
      },1050);
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
  transition.innerHTML='<div class="transition-door transition-door-left"></div><div class="transition-door transition-door-right"></div><div class="transition-seam"></div><div class="transition-sign"><div><b>B&amp;B</b><span>Backyard Podcast</span></div></div>';
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

// Scroll reveal: content fades/slides in while visible and fades back out after leaving view.
(()=>{
  const selector=[
    '.hero h1','.hero p','.hero .actions','.hero-logo',
    '.page-hero .eyebrow','.page-hero h1','.page-hero p',
    '.section > .container > .eyebrow','.section > .container > .section-title',
    '.section .card','.section .notice','.section .actions',
    '.section > .container > p','.section > .container > ul','.section > .container > ol',
    '.live-neon-status','.main-stream-card','.chat-panel','.footer-wrap'
  ].join(',');
  const items=[...new Set(qsa(selector))].filter(el=>!el.closest('.page-transition')&&!el.closest('.loader'));
  items.forEach((el,i)=>{
    el.classList.add('bb-reveal');
    el.style.setProperty('--reveal-delay',`${Math.min((i%4)*55,165)}ms`);
  });
  if(!('IntersectionObserver' in window)){
    items.forEach(el=>el.classList.add('is-visible'));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('is-visible',entry.isIntersecting));
  },{threshold:.09,rootMargin:'0px 0px -5% 0px'});
  items.forEach(el=>observer.observe(el));
})();

// Neon scroll-to-top button. It shifts from cyan/blue near the top to red near the bottom.
(()=>{
  const btn=document.createElement('button');
  btn.className='bb-scroll-top';
  btn.type='button';
  btn.setAttribute('aria-label','Scroll to top');
  btn.innerHTML='<span aria-hidden="true">↑</span><small>TOP</small>';
  document.body.appendChild(btn);
  const update=()=>{
    const doc=document.documentElement;
    const max=Math.max(1,doc.scrollHeight-innerHeight);
    const p=Math.max(0,Math.min(1,scrollY/max));
    // cyan/blue -> red
    const r=Math.round(67+(255-67)*p), g=Math.round(245+(32-245)*p), b=Math.round(255+(56-255)*p);
    btn.style.setProperty('--scroll-neon',`rgb(${r} ${g} ${b})`);
    btn.style.setProperty('--scroll-progress',String(p));
    btn.classList.toggle('show',scrollY>260);
  };
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',update,{passive:true});
  update();
  btn.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
})();
