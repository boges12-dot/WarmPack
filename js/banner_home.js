
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
