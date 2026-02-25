document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  const getBase = () => {
    const v = getComputedStyle(root).getPropertyValue("--hero-h-base").trim();
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 300;
  };

  let BASE = getBase();
  let last = -1;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const apply = () => {
    const y = window.scrollY || 0;
    const c = clamp(y, 0, BASE);
    if (c === last) return;
    last = c;
    root.style.setProperty("--hero-collapse", c + "px");
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      apply();
    });
  }, { passive: true });

  window.addEventListener("resize", () => {
    BASE = getBase();
    apply();
  });

  apply();
});


// 자동 가나다 정렬 적용

function sortByKoreanName(arr){
  return arr.sort((a,b)=>a.name.trim().localeCompare(b.name.trim(),'ko'));
}

if(typeof tier1Items!=='undefined') sortByKoreanName(tier1Items);
if(typeof tier2Items!=='undefined') sortByKoreanName(tier2Items);
if(typeof tier3Items!=='undefined') sortByKoreanName(tier3Items);
