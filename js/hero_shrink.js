document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-main");
  if (!hero) return;

  // flicker 방지: on/off 임계값 분리
  const SHRINK_ON  = 180; // px
  const SHRINK_OFF = 80;  // px

  let isShrink = false;

  const update = () => {
    const y = window.scrollY || 0;
    if (!isShrink && y >= SHRINK_ON) {
      isShrink = true;
      hero.classList.add("is-shrink");
    } else if (isShrink && y <= SHRINK_OFF) {
      isShrink = false;
      hero.classList.remove("is-shrink");
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
});
