
// NAV_DEBUG:
// - window.NAV_DEBUG = true; (dev)
// - localStorage.setItem('NAV_DEBUG','1')
// - add ?navdebug=1 to URL
function navDebugEnabled(){
  try{
    if(window.NAV_DEBUG) return true;
    if(typeof location !== 'undefined' && /(?:\?|&)navdebug=1(?:&|$)/.test(location.search || '')) return true;
    if(typeof localStorage !== 'undefined' && localStorage.getItem('NAV_DEBUG') === '1') return true;
  }catch(e){}
  return false;
}

function navLog(){
  if(!navDebugEnabled()) return;
  try{
    if(console && console.debug) console.debug.apply(console, arguments);
    else if(console && console.log) console.log.apply(console, arguments);
  }catch(e){}
}

// Keyboard vs mouse intent detection:
// - Adds html.kbd-nav when the user uses Tab
// - Removes it on mousedown/touchstart
// This lets CSS enable :focus-within dropdowns only for keyboard navigation.
(function setupKeyboardNavClass(){
  var root = document.documentElement;
  if(!root) return;
  function enable(){ root.classList.add('kbd-nav'); }
  function disable(){ root.classList.remove('kbd-nav'); }
  document.addEventListener('keydown', function(e){
    if(e.key === 'Tab') enable();
  }, true);
  document.addEventListener('mousedown', disable, true);
  document.addEventListener('touchstart', disable, {passive:true, capture:true});
})();

function setAriaExpanded(el, open){
  if(!el) return;
  el.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function setOpenLi(li, open){
  if(!li) return;
  if(open) li.classList.add('is-open');
  else li.classList.remove('is-open');
  // Keep ARIA on the direct trigger element only
  var trigger = li.querySelector(':scope > a, :scope > button');
  setAriaExpanded(trigger, open);
}

function closeAllLis(selector, except){
  document.querySelectorAll(selector).forEach(function(li){
    if(except && li === except) return;
    setOpenLi(li, false);
  });
}

// ULNAV_CLICK_TOGGLE: blogger-style dropdown support (touch/click)
function initUlNavDropdown(){
  // Touch / small-screen click-toggle only (desktop uses hover + focus-within)
  var mqMobileLike = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 980px)');

  // Accessibility: ensure parent triggers expose submenu semantics.
  function setupNavAria(){
    try{
      document.querySelectorAll('#main-nav li.has-sub > a').forEach(function(a){
        if(!a.hasAttribute('aria-haspopup')) a.setAttribute('aria-haspopup','true');
        if(!a.hasAttribute('aria-expanded')) a.setAttribute('aria-expanded','false');
      });
      document.querySelectorAll('#main-nav li.has-sub > ul.submenu').forEach(function(ul){
        if(!ul.hasAttribute('role')) ul.setAttribute('role','menu');
      });
    }catch(e){}
  }

  setupNavAria();

  markCurrentNavLink();
  // Mark current page link for visual highlight (safe, no behavior change).
  function markCurrentNavLink(){
    try{
      if(typeof location === 'undefined') return;
      var cur = location.pathname || '';
      // Normalize: treat / and /index.html as equivalent
      function norm(p){
        if(!p) return '';
        // remove trailing /index.html
        p = p.replace(/\/index\.html$/,'/');
        // collapse multiple slashes
        p = p.replace(/\/+/g,'/');
        return p;
      }
      var curN = norm(cur);
      var curAlt = curN.endsWith('/') ? (curN + 'index.html') : (curN + '/index.html');

      var links = document.querySelectorAll('#main-nav a[href]');
      var matched = null;
      links.forEach(function(a){
        var u;
        try{ u = new URL(a.getAttribute('href'), location.href); }catch(e){ return; }
        var pn = norm(u.pathname);
        if(pn === curN || u.pathname === cur || u.pathname === curAlt){
          matched = a;
        }
      });
      if(!matched) return;

      // Clear any previous markers
      links.forEach(function(a){
        a.removeAttribute('aria-current');
        a.classList.remove('is-current');
      });
      document.querySelectorAll('#main-nav li.has-current').forEach(function(li){
        li.classList.remove('has-current');
      });

      matched.setAttribute('aria-current','page');
      matched.classList.add('is-current');

      // Also mark the top-level parent for underline highlight
      var topLi = matched.closest('li.has-sub');
      if(topLi){
        topLi.classList.add('has-current');
      }else{
        // If it's a top-level link without submenu
        var top = matched.closest('#main-nav > li');
        if(top) top.classList.add('has-current');
      }
    }catch(e){}
  }



  // Guard: prevent accidental open/close while the user is scrolling on touch devices.
  // (Some browsers still fire a click after a small finger drag.)
  var touchState = { active:false, moved:false, x:0, y:0 };

  function isMobileLike(){
    return !!(mqMobileLike && mqMobileLike.matches);
  }

  // Track touch movement only when we start on a parent menu link
  document.addEventListener('touchstart', function(e){
    if(!isMobileLike()) return;
    var a = e.target.closest && e.target.closest('#main-nav li.has-sub > a');
    if(!a || !e.touches || !e.touches[0]){
      touchState.active = false;
      return;
    }
    touchState.active = true;
    touchState.moved = false;
    touchState.x = e.touches[0].clientX;
    touchState.y = e.touches[0].clientY;
  }, {passive:true});

  document.addEventListener('touchmove', function(e){
    if(!touchState.active || touchState.moved) return;
    if(!e.touches || !e.touches[0]) return;
    var dx = Math.abs(e.touches[0].clientX - touchState.x);
    var dy = Math.abs(e.touches[0].clientY - touchState.y);
    if(dx > 12 || dy > 12){
      touchState.moved = true;
    }
  }, {passive:true});

  function closeAll(except){
    closeAllLis('#main-nav li.has-sub.is-open', except);
  }

  // Initialize ARIA state
  document.querySelectorAll('#main-nav li.has-sub > a').forEach(function(a){
    a.setAttribute('aria-haspopup','true');
    setAriaExpanded(a, false);
  });

  document.addEventListener('click', function(e){
    // Desktop: allow normal navigation on parent links
    if(!isMobileLike()) return;

    // Ignore non-primary button clicks (mouse)
    if(typeof e.button === 'number' && e.button !== 0) return;

    var a = e.target.closest('#main-nav li.has-sub > a');
    if(!a){
      // Only close when clicking outside the whole nav (so submenu clicks don't flicker)
      if(!e.target.closest('#main-nav')) closeAll();
      return;
    }

    // If this click was generated after a scroll-like touch move, do nothing.
    if(touchState.active && touchState.moved){
      touchState.active = false;
      return;
    }
    touchState.active = false;

    var li = a.closest('#main-nav li.has-sub');
    if(!li) return;

    var willOpen = !li.classList.contains('is-open');

    if(willOpen){
      e.preventDefault(); // first tap opens
      closeAll(li);
      setOpenLi(li, true);
      navLog('[NAV] open', {mode:'mobile-like', text:a.textContent && a.textContent.trim()});
    }else{
      // second tap follows the link naturally (no preventDefault)
      closeAll();
      navLog('[NAV] closeAll', {mode:'mobile-like'});
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      closeAll();
      navLog('[NAV] esc closeAll', {scope:'main-nav'});
    }
  });


  // Close menus when keyboard focus moves outside the main nav (desktop-friendly).
  document.addEventListener('focusin', function(e){
    var nav = document.getElementById('main-nav');
    if(!nav) return;
    if(nav.contains(e.target)) return;
    // If any is open, close them.
    if(nav.querySelector('li.has-sub.is-open')){
      closeAll();
      navLog('[NAV] focus left nav -> closeAll', {scope:'main-nav'});
    }
  });


  // If we cross to desktop, ensure any click-open state is cleared
  if(mqMobileLike && mqMobileLike.addEventListener){
    mqMobileLike.addEventListener('change', function(){
      if(!isMobileLike()){
        closeAll();
        navLog('[NAV] mq change -> desktop, closeAll', {scope:'main-nav'});
      }
    });
  }else if(mqMobileLike && mqMobileLike.addListener){
    mqMobileLike.addListener(function(){
  // Prevent double-initialization (safe if script included twice).
  if(window.__HYBRID_SITE_INITED){ return; }
  window.__HYBRID_SITE_INITED = true;

      if(!isMobileLike()){
        closeAll();
        navLog('[NAV] mq change -> desktop, closeAll', {scope:'main-nav'});
      }
    });
  }
}


(function(){
  function closeAll(except){
    closeAllLis('.has-sub.is-open', except);
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
        navLog('[NAV] legacy outside click closeAll');
        return;
      }

      var item = trigger.closest('.has-sub');
      if(!item) return;

      // If user clicks the "제작" link, treat as toggle (desktop UX)
      e.preventDefault();

      var willOpen = !item.classList.contains('is-open');
      closeAll(item);
      if(willOpen){
        setOpenLi(item, true);
        navLog('[NAV] legacy open', {text: trigger.textContent && trigger.textContent.trim()});
      }else{
        setOpenLi(item, false);
        navLog('[NAV] legacy close', {text: trigger.textContent && trigger.textContent.trim()});
      }
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        closeAll();
        navLog('[NAV] legacy esc closeAll');
      }
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
    navLog('[NAV] init', {debug: navDebugEnabled(), build: (typeof HYBRID_BUILD !== 'undefined' ? HYBRID_BUILD : '')});

    // Capture runtime errors only in debug mode so production stays quiet.
    if(navDebugEnabled()){
      try{
        window.addEventListener('error', function(ev){
          navWarn('[NAV] window.error', {message: ev && ev.message, filename: ev && ev.filename, lineno: ev && ev.lineno, colno: ev && ev.colno});
        });
        window.addEventListener('unhandledrejection', function(ev){
          navWarn('[NAV] unhandledrejection', {reason: ev && ev.reason});
        });
      }catch(e){}
    }

    // Init in isolated blocks so one failure doesn't break the rest.
    try{ initUlNavDropdown(); }catch(e){ navWarn('[NAV] initUlNavDropdown failed', e); }
    try{ initDropdown(); }catch(e){ navWarn('[NAV] initDropdown failed', e); }

    try{ initToTop(); }catch(e){ navWarn('[NAV] initToTop failed', e); }
    try{ markActive(); }catch(e){ navWarn('[NAV] markActive failed', e); }
  });});
})();
// Build/version stamp (ops)
// Keep as plain string so it can be used for cache-busting if needed in the future.
var HYBRID_BUILD = 'v2.3.9-ops';

// Tiny polyfills for older browsers (defensive; no behavior change on modern browsers).
(function(){
  try{
    if(!Element.prototype.matches){
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    if(!Element.prototype.closest){
      Element.prototype.closest = function(s){
        var el = this;
        while(el && el.nodeType === 1){
          if(el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        }
        return null;
      };
    }
  }catch(e){}
})();

