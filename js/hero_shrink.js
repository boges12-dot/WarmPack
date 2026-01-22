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
