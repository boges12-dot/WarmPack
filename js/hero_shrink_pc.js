
(function(){
  function onScroll(){
    if (window.innerWidth < 981) return;
    var hero = document.querySelector(".hero-main");
    if (!hero) return;
    if (window.scrollY > 80){
      hero.classList.add("is-shrink");
    } else {
      hero.classList.remove("is-shrink");
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  });
})();
