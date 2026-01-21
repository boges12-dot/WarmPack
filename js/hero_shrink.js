document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const wrap = document.querySelector(".hero-wrap");
  if (!wrap) return;

  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

  const readBaseHero = () => {
    const v = getComputedStyle(root).getPropertyValue("--hero-h").trim();
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 250;
  };

  let BASE_H = readBaseHero();

  const update = () => {
    const y = window.scrollY || 0;
    const newH = clamp(BASE_H - y, 0, BASE_H);

    // 실제 레이아웃 높이를 줄여서(공간도 함께 줄어듦) 배너+메뉴가 자연스럽게 위로 올라감
    root.style.setProperty("--hero-h", newH + "px");

    // 기존 translateY 방식은 공간이 남을 수 있어서 0으로 고정
    root.style.setProperty("--wrap-offset", "0px");
  };

  let ticking=false;
  window.addEventListener("scroll", ()=>{
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(()=>{ ticking=false; update(); });
  }, { passive:true });

  window.addEventListener("resize", () => {
    BASE_H = readBaseHero();
    update();
  });

  update();
});
