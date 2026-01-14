(function(){
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('menuToggle');
  const isMobile = () => window.matchMedia('(max-width: 980px)').matches;

  if(toggle && nav){
    toggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      if(!open){
        nav.querySelectorAll('.nav-item.open').forEach(x=>x.classList.remove('open'));
        nav.querySelectorAll('.nav-btn[aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'));
      }
    });
  }

  document.querySelectorAll('.nav-item.has-sub > .nav-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      if(!isMobile()) return;
      e.preventDefault();
      const item = btn.closest('.nav-item');
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.nav-item.open').forEach(x=>{
        if(x!==item) x.classList.remove('open');
      });
      document.querySelectorAll('.nav-btn[aria-expanded="true"]').forEach(b=>{
        if(b!==btn) b.setAttribute('aria-expanded','false');
      });

      item.classList.toggle('open', !expanded);
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });

  document.addEventListener('click', (e)=>{
    if(!isMobile()) return;
    if(!nav || !toggle) return;
    if(nav.contains(e.target) || toggle.contains(e.target)) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    nav.querySelectorAll('.nav-item.open').forEach(x=>x.classList.remove('open'));
  });

  window.addEventListener('resize', ()=>{
    if(!nav || !toggle) return;
    if(!isMobile()){
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      nav.querySelectorAll('.nav-item.open').forEach(x=>x.classList.remove('open'));
      nav.querySelectorAll('.nav-btn[aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'));
    }
  });
})();
