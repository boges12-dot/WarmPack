
(function(){
  function ensureButton(){
    if (document.getElementById("wpTopBtn")) return;
    var btn = document.createElement("button");
    btn.id = "wpTopBtn";
    btn.type = "button";
    btn.className = "wp-top-btn is-visible";
    btn.setAttribute("aria-label", "맨위로");
    btn.textContent = "맨위로";
    btn.addEventListener("click", function(){
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(btn);
  }

  document.addEventListener("DOMContentLoaded", function(){
    ensureButton();
  });
})();
