const toggle=document.getElementById('menuToggle');
const nav=document.getElementById('siteNav');
toggle.onclick=()=>nav.classList.toggle('open');
document.querySelectorAll('.nav-btn').forEach(b=>{
  b.onclick=()=>b.parentElement.classList.toggle('open');
});
