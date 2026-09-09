const qs=(s,p=document)=>p.querySelector(s), qsa=(s,p=document)=>[...p.querySelectorAll(s)];
const loader=qs('#siteLoader');
const hasSeen=sessionStorage.getItem('bb-loader-seen');
if(hasSeen){loader?.classList.add('hide')}else{window.addEventListener('load',()=>setTimeout(()=>{loader?.classList.add('hide');sessionStorage.setItem('bb-loader-seen','1')},1550));}
const menu=qs('#menuBtn'),links=qs('#navLinks');menu?.addEventListener('click',()=>links?.classList.toggle('open'));qsa('.nav-link').forEach(a=>a.addEventListener('click',()=>links?.classList.remove('open')));
const path=location.pathname.split('/').pop()||'index.html';qsa('.nav-link').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active')});
window.bbToast=(title,message,link)=>{const stack=qs('#toastStack');if(!stack)return;const el=document.createElement(link?'a':'div');el.className='toast';if(link)el.href=link;el.innerHTML=`<b>${title}</b><p>${message}</p>`;stack.appendChild(el);setTimeout(()=>el.remove(),8000)};
qsa('[data-demo-toast]').forEach(btn=>btn.addEventListener('click',()=>window.bbToast('B&B IS LIVE','The Backyard Podcast is live now. Tap to join the stream.','live.html')));
const year=qs('[data-year]');if(year)year.textContent=new Date().getFullYear();

// B&B neon page transition for internal page links.
(() => {
  const transition = document.createElement('div');
  transition.className = 'page-transition';
  transition.id = 'pageTransition';
  transition.setAttribute('aria-hidden', 'true');
  transition.innerHTML = '<div class="transition-sign"><div><b>B&amp;B</b><span>Backyard Podcast</span></div></div>';
  document.body.appendChild(transition);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank' || link.hasAttribute('download')) return;
    let url;
    try { url = new URL(link.href, location.href); } catch { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return;
    event.preventDefault();
    transition.classList.add('show');
    setTimeout(() => { location.href = link.href; }, 420);
  });

  window.addEventListener('pageshow', () => transition.classList.remove('show'));
})();
