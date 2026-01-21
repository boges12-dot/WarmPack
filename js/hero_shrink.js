document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-main");
  if (!hero) return;

  const HERO_H = 460;

  // 내릴 때 숨김 / 올릴 때 복귀 (깜빡임 방지 완충)
  const HIDE_ON  = 120; // 이 이상 내려가면 배너 숨김
  const SHOW_OFF = 60;  // 이 이하로 올라오면 배너 표시

  let isHidden = false;

  const apply = () => {
    const y = window.scrollY || 0;

    if (!isHidden && y >= HIDE_ON) {
      isHidden = true;
      hero.style.setProperty("--hero-cur", "0px");
      hero.style.setProperty("--hero-op", "0");
      return;
    }

    if (isHidden && y <= SHOW_OFF) {
      isHidden = false;
      hero.style.setProperty("--hero-cur", HERO_H + "px");
      hero.style.setProperty("--hero-op", "1");
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      apply();
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", apply);

  // 초기값
  hero.style.setProperty("--hero-cur", HERO_H + "px");
  hero.style.setProperty("--hero-op", "1");
  apply();
});
