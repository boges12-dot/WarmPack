document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-main");
  if (!hero) return;

  // 내려가면 줄어듦 / 올라오면 커짐 (완충지대)
  const SHRINK_ON  = 180; // >= 이면 shrink
  const SHRINK_OFF = 120; // <= 이면 expand

  let isShrink = false;
  let lockUntil = 0;

  const setShrink = (next) => {
    isShrink = next;
    // next=true => is-shrink 추가(=줄어듦)
    hero.classList.toggle("is-shrink", next);
    lockUntil = performance.now() + 300; // transition 동안 재토글 방지
  };

  const update = () => {
    const now = performance.now();
    if (now < lockUntil) return;

    const y = window.scrollY || 0;

    if (!isShrink && y >= SHRINK_ON) {
      setShrink(true);
      return;
    }

    if (isShrink && y <= SHRINK_OFF) {
      setShrink(false);
    }
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  }, { passive: true });

  update();
});
