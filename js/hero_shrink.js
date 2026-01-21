document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".hero-wrap");
  if (!wrap) return;

  const HERO_H = 460;
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

  const update = () => {
    const y = window.scrollY || 0;
    const offset = -clamp(y, 0, HERO_H);
    wrap.style.setProperty("--wrap-offset", offset + "px");
  };

  let ticking=false;
  window.addEventListener("scroll", ()=>{
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(()=>{ ticking=false; update(); });
  },{passive:true});

  window.addEventListener("resize", update);
  update();
});
