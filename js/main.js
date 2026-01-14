(function(){
  const menuToggle=document.getElementById('menuToggle');
  const siteNav=document.getElementById('siteNav');
  if(!menuToggle||!siteNav) return;

  const isMobile=()=>window.matchMedia('(max-width: 980px)').matches;

  menuToggle.addEventListener('click',()=>{
    const open=siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    if(!open) closeAll();
  });

  siteNav.addEventListener('click',(e)=>{
    const btn=e.target.closest('.nav-item.has-sub > .nav-btn');
    if(!btn) return;
    if(!isMobile()) return;
    e.preventDefault();

    const item=btn.closest('.nav-item');
    const expanded=btn.getAttribute('aria-expanded')==='true';

    [...siteNav.querySelectorAll('.nav-item.has-sub')].forEach(li=>{
      if(li!==item){
        li.classList.remove('open');
        const b=li.querySelector('.nav-btn');
        if(b) b.setAttribute('aria-expanded','false');
      }
    });

    item.classList.toggle('open', !expanded);
    btn.setAttribute('aria-expanded', String(!expanded));
  });

  document.addEventListener('click',(e)=>{
    if(!isMobile()) return;
    if(siteNav.contains(e.target)||menuToggle.contains(e.target)) return;
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
    closeAll();
  });

  window.addEventListener('resize',()=>{
    if(!isMobile()){
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
      closeAll();
    }
  });

  function closeAll(){
    siteNav.querySelectorAll('.nav-item.has-sub').forEach(li=>{
      li.classList.remove('open');
      const b=li.querySelector('.nav-btn');
      if(b) b.setAttribute('aria-expanded','false');
    });
  }
})();
