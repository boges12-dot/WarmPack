document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-main");
  if (!hero || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      hero.classList.toggle("is-hidden", !e.isIntersecting);
    });
  }, {threshold:0});

  observer.observe(hero);
});
