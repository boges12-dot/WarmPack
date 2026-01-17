/*
  main.20260116_16.js
  STEP4 (JS cleanup)
  - Consolidated nav dropdown logic (removed duplicate legacy handler)
  - Removed global document mousemove (close on nav mouseleave)
  - Keeps existing CSS hooks: .hovering / .is-open
*/

(function(){
  'use strict';

  var nav = document.getElementById('main-nav');
  if(!nav) return;

  // Desktop-like hover detection
  var canHover = false;
  try {
    canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  } catch(e) {}

  function qsa(sel, root){
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function closeAll(except){
    qsa('#main-nav li.has-sub.is-open', document).forEach(function(li){
      if(except && li === except) return;
      li.classList.remove('is-open');
      li.classList.remove('hovering');
      var a = li.querySelector(':scope > a, :scope > button');
      if(a) a.setAttribute('aria-expanded','false');
    });
  }

  function markActive(){
    // Active based on pathname; supports both /pages/섹션/ and /pages/섹션/index.html
    var path = location.pathname.replace(/\/index\.html$/, '/');
    var links = qsa('#main-nav a, #main-nav .submenu a', document);

    links.forEach(function(a){
      try {
        var href = a.getAttribute('href');
        if(!href) return;
        var url = new URL(href, location.origin);
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
      } catch(e) {}
    });
  }

  function initToTop(){
    document.addEventListener('click', function(e){
      var btn = e.target && e.target.closest ? e.target.closest('[data-to-top]') : null;
      if(!btn) return;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initUlNavDropdown(){
    // Click/tap support (mobile + desktop). Parent links do not navigate; they toggle.
    document.addEventListener('click', function(e){
      var a = e.target && e.target.closest ? e.target.closest('#main-nav li.has-sub > a') : null;

      // Clicking outside nav closes open menus
      if(!a){
        if(!e.target || !e.target.closest || !e.target.closest('#main-nav')){
          closeAll();
        }
        return;
      }

      var li = a.closest('#main-nav li.has-sub');
      if(!li) return;

      // Toggle only; no navigation on parent
      e.preventDefault();

      var willOpen = !li.classList.contains('is-open');
      closeAll(li);
      if(willOpen){
        li.classList.add('is-open');
        li.classList.add('hovering');
        a.setAttribute('aria-expanded','true');
      } else {
        li.classList.remove('is-open');
        li.classList.remove('hovering');
        a.setAttribute('aria-expanded','false');
      }
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeAll();
    });

    // Desktop: close when cursor leaves entire nav region (replaces old document mousemove)
    if(canHover){
      nav.addEventListener('mouseleave', function(){
        closeAll();
      });
    }
  }

  function initUlNavHoverDelay(){
    // Desktop: keep submenu open briefly while moving cursor
    if(!canHover) return;

    var CLOSE_DELAY_MS = 0;
    qsa('#main-nav li.has-sub', nav).forEach(function(li){
      var t = null;

      li.addEventListener('mouseenter', function(){
        if(t){ clearTimeout(t); t = null; }
        li.classList.add('hovering');
      });

      li.addEventListener('mouseleave', function(){
        if(t) clearTimeout(t);
        t = setTimeout(function(){
          li.classList.remove('hovering');
          li.classList.remove('is-open');
        }, CLOSE_DELAY_MS);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    initUlNavDropdown();
    initUlNavHoverDelay();
    initToTop();
    markActive();
  });
})();
