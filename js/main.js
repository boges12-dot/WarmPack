(function(){
  function closeAll(except){
    document.querySelectorAll('.has-sub.is-open').forEach(function(el){
      if(except && el === except) return;
      el.classList.remove('is-open');
      var a = el.querySelector(':scope > a, :scope > button');
      if(a) a.setAttribute('aria-expanded','false');
    });
  }

  function markActive(){
    // Active based on pathname; supports both /pages/섹션/ and /pages/섹션/index.html
    var path = location.pathname.replace(/\/index\.html$/, '/');
    var links = document.querySelectorAll('.nav a.nav-link, .sub a.sub-link');
    links.forEach(function(a){
      try{
        var url = new URL(a.getAttribute('href'), location.origin);
        var p = url.pathname.replace(/\/index\.html$/, '/');
        if(p === path){
          a.classList.add('active');
          // if it's inside dropdown, also highlight parent
          var parent = a.closest('.has-sub');
          if(parent){
            var parentLink = parent.querySelector(':scope > a.nav-link');
            if(parentLink) parentLink.classList.add('active');
          }
        }
      }catch(e){}
    });
  }

  function initDropdown(){
    document.addEventListener('click', function(e){
      var trigger = e.target.closest('.has-sub > a.nav-link, .has-sub > button');
      if(!trigger){
        // Outside click closes
        closeAll();
        return;
      }

      var item = trigger.closest('.has-sub');
      if(!item) return;

      // If user clicks the "제작" link, treat as toggle (desktop UX)
      e.preventDefault();

      var willOpen = !item.classList.contains('is-open');
      closeAll(item);
      if(willOpen){
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded','true');
      }else{
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded','false');
      }
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeAll();
    });
  }

  function initToTop(){
    document.addEventListener('click', function(e){
      var btn = e.target.closest('[data-to-top]');
      if(!btn) return;
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    initDropdown();
    initToTop();
    markActive();
  });
})();
