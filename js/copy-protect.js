
(function(){
  function isPromoPage() {
    return document.body && document.body.classList.contains("page-promo");
  }

  function blockIfNeeded(e) {
    if (!isPromoPage()) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  document.addEventListener("contextmenu", function(e){
    return blockIfNeeded(e);
  }, true);

  document.addEventListener("copy", function(e){
    return blockIfNeeded(e);
  }, true);

  document.addEventListener("cut", function(e){
    return blockIfNeeded(e);
  }, true);

  document.addEventListener("paste", function(e){
    return blockIfNeeded(e);
  }, true);

  document.addEventListener("dragstart", function(e){
    return blockIfNeeded(e);
  }, true);

  document.addEventListener("selectstart", function(e){
    return blockIfNeeded(e);
  }, true);

  document.addEventListener("mousedown", function(e){
    if (!isPromoPage() && e.detail > 1) {
      e.preventDefault();
    }
  }, true);

  document.addEventListener("keydown", function(e){
    if (isPromoPage()) return;

    const k = (e.key || "").toLowerCase();

    if (
      e.key === "F12" ||
      (e.ctrlKey && ["c","u","s","a","p","x","v"].includes(k)) ||
      (e.ctrlKey && e.shiftKey && ["i","j","c","k"].includes(k))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Mobile long-press / selection hardening
  document.addEventListener("touchstart", function(){
    if (!isPromoPage()) {
      document.documentElement.classList.add("copy-protect-active");
    }
  }, { passive: true });

  // Developer tools size-difference heuristic
  let devtoolsWarningShown = false;
  function detectDevtools(){
    if (isPromoPage()) return;
    const threshold = 160;
    const opened =
      (window.outerWidth - window.innerWidth > threshold) ||
      (window.outerHeight - window.innerHeight > threshold);

    if (opened) {
      document.documentElement.classList.add("devtools-opened");
      if (!devtoolsWarningShown) {
        devtoolsWarningShown = true;
      }
    } else {
      document.documentElement.classList.remove("devtools-opened");
    }
  }

  setInterval(detectDevtools, 1200);
  window.addEventListener("resize", detectDevtools);
  detectDevtools();
})();
