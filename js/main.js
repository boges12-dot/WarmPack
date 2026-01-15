(function(){
  const nav = document.getElementById('mainNav');
  if(nav){
    nav.addEventListener('wheel', (e)=>{
      if(e.shiftKey) return;
      const dx = (Math.abs(e.deltaY) > Math.abs(e.deltaX)) ? e.deltaY : e.deltaX;
      if(dx === 0) return;
      nav.scrollLeft += dx;
      e.preventDefault();
    }, {passive:false});
  }

  function alignDropdown(item){
    const sub = item.querySelector('.sub');
    if(!sub) return;
    sub.classList.remove('align-right');

    const wasHidden = getComputedStyle(sub).display === 'none';
    if(wasHidden) sub.style.display = 'block';

    const rect = sub.getBoundingClientRect();
    const overflowRight = rect.right > window.innerWidth - 8;
    const overflowLeft  = rect.left < 8;
    if(overflowRight && !overflowLeft) sub.classList.add('align-right');

    if(wasHidden) sub.style.display = '';
  }

  const items = [...document.querySelectorAll('.nav-item.has-sub')];
  items.forEach(item=>{
    item.addEventListener('mouseenter', ()=>alignDropdown(item));
    item.addEventListener('focusin', ()=>alignDropdown(item));
  });

  window.addEventListener('resize', ()=>{
    items.forEach(item=>{
      const sub = item.querySelector('.sub');
      if(sub) sub.classList.remove('align-right');
    });
  });
})();