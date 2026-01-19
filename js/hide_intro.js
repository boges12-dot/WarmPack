
(function(){
  var KEY = "게임 서버 정보";
  function hideIntro(){
    // Find any element that contains the intro sentence and hide its nearest card/section
    var all = Array.prototype.slice.call(document.querySelectorAll("section,div,article"));
    for (var i=0; i<all.length; i++){
      var el = all[i];
      if (!el || !el.textContent) continue;
      var t = el.textContent.replace(/\s+/g," ").trim();
      if (t.indexOf(KEY) === -1) continue;
      // Require also the phrase '한 곳에서 확인' to avoid false positives
      if (t.indexOf("한 곳에서") === -1 && t.indexOf("확인할 수") === -1) continue;

      // Prefer hiding a card-like container
      var target = el.closest(".card, .panel, .box, .section, .content-card, .intro, .overview") || el;
      target.classList.add("wp-hidden-intro");
      // Usually this block appears once; stop after first
      break;
    }
  }

  document.addEventListener("DOMContentLoaded", hideIntro);
})();
