
// Robust "go home" for GitHub Pages project sites + normal hosting
(function(){
  function getSiteRoot(){
    var path = window.location.pathname || "/";
    if (!path.startsWith("/")) path = "/" + path;
    // GitHub Pages project site: https://<user>.github.io/<repo>/...
    if (window.location.hostname.endsWith("github.io")){
      var parts = path.split("/").filter(Boolean);
      if (parts.length >= 1){
        return "/" + parts[0] + "/";
      }
    }
    return "/";
  }

  function goHome(e){
    e.preventDefault();
    window.location.href = getSiteRoot();
  }

  document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll(".nav-home, .top-banner-link").forEach(function(a){
      a.addEventListener("click", goHome);
    });
  });
})();


// 자동 가나다 정렬 적용

function sortByKoreanName(arr){
  return arr.sort((a,b)=>a.name.trim().localeCompare(b.name.trim(),'ko'));
}

if(typeof tier1Items!=='undefined') sortByKoreanName(tier1Items);
if(typeof tier2Items!=='undefined') sortByKoreanName(tier2Items);
if(typeof tier3Items!=='undefined') sortByKoreanName(tier3Items);


/* ===== PATCH: 드롭다운 겹침 방지 (항상 하나만 열기) ===== */
document.addEventListener("DOMContentLoaded", function () {
  const menus = document.querySelectorAll(".nav-item");
  menus.forEach(menu => {
    menu.addEventListener("mouseenter", function () {
      menus.forEach(m => {
        const dd = m.querySelector(".dropdown");
        if (dd) dd.style.display = "none";
      });
      const dropdown = menu.querySelector(".dropdown");
      if (dropdown) dropdown.style.display = "block";
    });

    menu.addEventListener("mouseleave", function () {
      const dropdown = menu.querySelector(".dropdown");
      if (dropdown) dropdown.style.display = "none";
    });
  });
});
/* ================================================ */

