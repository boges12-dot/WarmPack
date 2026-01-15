
// ULNAV_CLICK_TOGGLE: blogger-style dropdown support (touch/click)
function initUlNavDropdown(){
  // Touch / small-screen click-toggle only (desktop uses hover + focus-within)
  var mqMobileLike = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 980px)');

  function isMobileLike(){
    return !!(mqMobileLike && mqMobileLike.matches);
  }

  function closeAll(except){
    document.querySelectorAll('#main-nav li.has-sub.is-open').forEach(function(li){
      if(except && li === except) return;
      li.classList.remove('is-open');
      var a = li.querySelector(':scope > a');
      if(a) a.setAttribute('aria-expanded','false');
    });
  }

  // Initialize ARIA state
  document.querySelectorAll('#main-nav li.has-sub > a').forEach(function(a){
    a.setAttribute('aria-haspopup','true');
    a.setAttribute('aria-expanded','false');
  });

  document.addEventListener('click', function(e){
    // Desktop: allow normal navigation on parent links
    if(!isMobileLike()) return;

    var a = e.target.closest('#main-nav li.has-sub > a');
    if(!a){
      closeAll();
      return;
    }

    var li = a.closest('#main-nav li.has-sub');
    if(!li) return;

    var willOpen = !li.classList.contains('is-open');

    if(willOpen){
      e.preventDefault(); // first tap opens
      closeAll(li);
      li.classList.add('is-open');
      a.setAttribute('aria-expanded','true');
    }else{
      // second tap follows the link naturally (no preventDefault)
      closeAll();
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      closeAll();
    }
  });

  // If we cross to desktop, ensure any click-open state is cleared
  if(mqMobileLike && mqMobileLike.addEventListener){
    mqMobileLike.addEventListener('change', function(){
      if(!isMobileLike()) closeAll();
    });
  }else if(mqMobileLike && mqMobileLike.addListener){
    mqMobileLike.addListener(function(){
      if(!isMobileLike()) closeAll();
    });
  }
}


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
    var links = document.querySelectorAll('#main-nav a, #main-nav .submenu a');
    links.forEach(function(a){
      try{
        var url = new URL(a.getAttribute('href'), location.origin);
        var p = url.pathname.replace(/\/index\.html$/, '/');
        if(p === path){
          a.classList.add('active');
          // if it's inside dropdown, also highlight parent
          var parent = a.closest('.has-sub');
          if(parent){
            var parentLink = parent.querySelector(':scope > a');
            if(parentLink) parentLink.classList.add('active');
          }
        }
      }catch(e){}
    });
  }

  function initDropdown(){
    // legacy dropdown (not used in UL nav)

    document.addEventListener('click', function(e){
      var trigger = e.target.closest('.has-sub > a, .has-sub > button');
      if(trigger && trigger.closest('#main-nav')) return;
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
      initUlNavDropdown();
    initDropdown();
      // UL nav dropdown

    initToTop();
    markActive();
  });
})();
