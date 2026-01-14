(function(){
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('menuToggle');
  if(toggle && nav){
    toggle.addEventListener('click', ()=>{
      nav.classList.toggle('open');
    });
  }

  // Dropdown buttons
  document.querySelectorAll('.nav-item > button[data-dropdown]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      // mobile + desktop click support
      const item = btn.closest('.nav-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.nav-item.open').forEach(x=>{ if(x!==item) x.classList.remove('open'); });
      item.classList.toggle('open', !isOpen);
      e.preventDefault();
      e.stopPropagation();
    });
  });

  // click outside closes dropdowns
  document.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-item.open').forEach(x=>x.classList.remove('open'));
  });
})();