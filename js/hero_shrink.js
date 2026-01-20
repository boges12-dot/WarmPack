document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-main");
  if (!hero) return;

  // Hysteresis prevents flicker/jitter near threshold
  const SHRINK_ON  = 140; // px: shrink when above this
  const SHRINK_OFF = 60;  // px: expand when below this

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
