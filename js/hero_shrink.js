document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const hero = document.querySelector(".hero-main");
  if (!hero) return;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const readBaseHero = () => {
    const v = getComputedStyle(root).getPropertyValue("--hero-h").trim();
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 300;
  };

  let BASE_H = readBaseHero();

  const update = () => {
    const y = window.scrollY || 0;
    const collapse = clamp(y, 0, BASE_H);
    const h = Math.max(0, BASE_H - collapse);
    root.style.setProperty("--hero-h", h + "px");
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    BASE_H = readBaseHero();
    update();
  });

  update();
});
