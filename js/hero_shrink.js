document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-main");
  if (!hero) return;

  const shrinkAt = 80; // px
  const onScroll = () => {
    if (window.scrollY > shrinkAt) hero.classList.add("is-shrink");
    else hero.classList.remove("is-shrink");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
