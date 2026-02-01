document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('ul.submenu').forEach(ul=>{
    const seen = new Set();
    ul.querySelectorAll('li').forEach(li=>{
      const a = li.querySelector('a');
      if(!a) return;
      const key = (a.getAttribute('href')||'') + '|' + (a.textContent||'').trim();
      if(seen.has(key)){
        li.remove();
      } else {
        seen.add(key);
      }
    });
  });
});