const qs=(s,p=document)=>p.querySelector(s), qsa=(s,p=document)=>[...p.querySelectorAll(s)];
const loader=qs('#siteLoader');
const hasSeen=sessionStorage.getItem('bb-loader-seen');

function runBBLoader(){
  if(!loader) return;
  const percentEl=qs('#loaderPercent');
  const progressEl=qs('#loaderProgress');
  const messageEl=qs('#loaderMessage');
  loader.classList.add('powering');
  let progress=0;
  const messages=[
    [0,'Neon circuits warming up'],[28,'Lighting the backyard wall'],[56,'Tuning the podcast signal'],[82,'Powering the B&B sign']
  ];
  const timer=setInterval(()=>{
    const remaining=100-progress;
    const step=remaining>40 ? Math.ceil(Math.random()*4)+1 : remaining>14 ? Math.ceil(Math.random()*3)+1 : 1;
    progress=Math.min(100,progress+step);
    if(percentEl) percentEl.textContent=progress+'%';
    if(progressEl) progressEl.style.width=progress+'%';
    for(const [at,text] of messages){ if(progress>=at && messageEl) messageEl.textContent=text; }
    if(progress>=100){
      clearInterval(timer);
      loader.classList.remove('powering');
      loader.classList.add('neon-on');
      if(messageEl) messageEl.textContent='B&B Backyard Podcast — powered on';
      setTimeout(()=>{
        loader.classList.add('hide');
        sessionStorage.setItem('bb-loader-seen','1');
      },1050);
    }
  },55);
}

if(hasSeen){loader?.classList.add('hide')}else{
  if(document.readyState==='complete') runBBLoader();
  else window.addEventListener('load',runBBLoader,{once:true});
}

const menu=qs('#menuBtn'),links=qs('#navLinks');
menu?.addEventListener('click',()=>links?.classList.toggle('open'));
qsa('.nav-link').forEach(a=>a.addEventListener('click',()=>links?.classList.remove('open')));
const path=location.pathname.split('/').pop()||'index.html';
qsa('.nav-link').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active')});
window.bbToast=(title,message,link)=>{const stack=qs('#toastStack');if(!stack)return;const el=document.createElement(link?'a':'div');el.className='toast';if(link)el.href=link;el.innerHTML=`<b>${title}</b><p>${message}</p>`;stack.appendChild(el);setTimeout(()=>el.remove(),8000)};
qsa('[data-demo-toast]').forEach(btn=>btn.addEventListener('click',()=>window.bbToast('B&B IS LIVE','The Backyard Podcast is live now. Tap to join the stream.','live.html')));
const year=qs('[data-year]');if(year)year.textContent=new Date().getFullYear();

// B&B internal page transition: dark/off sign -> neon ignition -> next page.
(() => {
  const transition=document.createElement('div');
  transition.className='page-transition';
  transition.id='pageTransition';
  transition.setAttribute('aria-hidden','true');
  transition.innerHTML='<div class="transition-sign"><div><b>B&amp;B</b><span>Backyard Podcast</span></div></div>';
  document.body.appendChild(transition);

  document.addEventListener('click',(event)=>{
    const link=event.target.closest('a[href]');
    if(!link)return;
    const href=link.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||link.target==='_blank'||link.hasAttribute('download'))return;
    let url;try{url=new URL(link.href,location.href)}catch{return}
    if(url.origin!==location.origin)return;
    if(url.pathname===location.pathname&&url.hash)return;
    event.preventDefault();
    transition.classList.remove('sign-on');
    transition.classList.add('show');
    // Let the visitor clearly see the sign OFF first, then ignite it.
    setTimeout(()=>transition.classList.add('sign-on'),330);
    setTimeout(()=>{location.href=link.href},1180);
  });

  window.addEventListener('pageshow',()=>{
    transition.classList.remove('show','sign-on');
  });
})();
