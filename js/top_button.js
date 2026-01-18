
(function(){
  function findTopButtons(){
    var selectors = [
      "#toTop", "#topBtn", ".to-top", ".top-btn", ".btn-top", ".scroll-top", ".back-to-top",
      '[aria-label="맨위로"]', '[title="맨위로"]'
    ];
    var nodes = [];
    selectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(n){ nodes.push(n); });
    });
    // Fallback: elements containing the text "맨위로"
    document.querySelectorAll("a,button,div,span").forEach(function(el){
      if (el && el.textContent && el.textContent.trim() === "맨위로") nodes.push(el);
    });
    // de-dup
    return Array.from(new Set(nodes));
  }

  function update(btns){
    var show = window.scrollY > 160;
    btns.forEach(function(btn){
      btn.classList.add("floating-top-btn");
      btn.classList.toggle("is-visible", show);
    });
  }

  function bind(btns){
    btns.forEach(function(btn){
      btn.addEventListener("click", function(e){
        // if already has href to #top or similar, still prevent default to smooth scroll
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    var btns = findTopButtons();
    if (!btns.length) return;
    bind(btns);
    update(btns);
    window.addEventListener("scroll", function(){ update(btns); }, { passive: true });
  });
})();
