
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
    document.querySelectorAll(".hero-home-link").forEach(function(a){
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
