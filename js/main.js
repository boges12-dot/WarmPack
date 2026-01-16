
// ULNAV_CLICK_TOGGLE: blogger-style dropdown support (touch/click)
function initUlNavDropdown(){
  document.addEventListener('click', function(e){
    var a = e.target.closest('#main-nav li.has-sub > a');
    if(!a){
      document.querySelectorAll('#main-nav li.has-sub.is-open').forEach(function(li){ li.classList.remove('is-open'); });
      return;
    }
    var li = a.closest('#main-nav li.has-sub');
    if(!li) return;
    // toggle only; keep link navigation for second click by checking if already open
    if(!li.classList.contains('is-open')){
      e.preventDefault();
      document.querySelectorAll('#main-nav li.has-sub.is-open').forEach(function(x){ if(x!==li) x.classList.remove('is-open'); });
      li.classList.add('is-open');
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      document.querySelectorAll('#main-nav li.has-sub.is-open').forEach(function(li){ li.classList.remove('is-open'); });
    }
  });
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

    // ULNAV_HOVER_FAST_CLOSE: close quickly after mouse leaves (desktop)
  (function(){
    var nav = document.getElementById('main-nav');
    if(!nav) return;

    var canHover = false;
    try { canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch(e) {}
    if(!canHover) return;

    var CLOSE_DELAY_MS = 120;
    nav.querySelectorAll('li.has-sub').forEach(function(li){
      var t = null;
      li.addEventListener('mouseenter', function(){
        if(t){ clearTimeout(t); t=null; }
        // remove others
        nav.querySelectorAll('li.has-sub.is-open').forEach(function(x){ if(x!==li) x.classList.remove('is-open'); });
      });
      li.addEventListener('mouseleave', function(){
        if(t){ clearTimeout(t); }
        t = setTimeout(function(){
          li.classList.remove('is-open');
        }, CLOSE_DELAY_MS);
      });
    });
  })();


    initToTop();
    markActive();
  });
})();
