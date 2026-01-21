document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-main");
  if (!hero) return;

  // ✅ 레이아웃(height) 변화로 scrollY가 튀면서 ON/OFF가 반복되는 현상 방지용
  // - 줄어듦: 충분히 내려갔을 때만
  // - 복귀: 거의 최상단(0 근처)에서만
  const SHRINK_ON  = 180; // px
  const EXPAND_AT  = 10;  // px (거의 맨 위에서만 원복)

  let isShrink = false;
  let lockUntil = 0;

  const setShrink = (next) => {
    isShrink = next;
    hero.classList.toggle("is-shrink", next);
    // 토글 직후 몇 프레임 동안은 재토글 금지(쿨다운)
    lockUntil = performance.now() + 350;
  };

  const update = () => {
    const now = performance.now();
    if (now < lockUntil) return;

    const y = window.scrollY || 0;

    if (!isShrink && y >= SHRINK_ON) {
      setShrink(true);
      return;
    }

    if (isShrink && y <= EXPAND_AT) {
      setShrink(false);
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
