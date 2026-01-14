// dropdown only
document.querySelectorAll('.nav-item > button').forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.preventDefault();
    const sub = btn.nextElementSibling;
    document.querySelectorAll('.sub').forEach(s=>{
      if(s!==sub) s.style.display='none';
    });
    sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
  });
});
