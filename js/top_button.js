
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
    document.querySelectorAll("a,button,div,span").forEach(function(el){
      if (el && el.textContent && el.textContent.trim() === "맨위로") nodes.push(el);
    });
    return Array.from(new Set(nodes));
  }

  document.addEventListener("DOMContentLoaded", function(){
    var btns = findTopButtons();
    if (!btns.length) return;
    btns.forEach(function(btn){
      btn.classList.add("floating-top-btn","is-visible");
      btn.addEventListener("click", function(e){
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  });
})();
