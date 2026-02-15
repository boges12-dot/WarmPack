// === Block top-level navigation for menu items that have submenus ===
document.addEventListener("DOMContentLoaded", function(){
  var menuItems = document.querySelectorAll("#main-nav > li.has-sub > a");
  menuItems.forEach(function(link){
    link.addEventListener("click", function(e){
      e.preventDefault(); // stop page navigation
    });
  });
});
