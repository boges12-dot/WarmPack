// === banner_home.js ===

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


// === hero_shrink.js ===
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".hero-wrap");
  if (!wrap) return;

  const HERO_H = 460;
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

  const update = () => {
    const y = window.scrollY || 0;
    const offset = -clamp(y, 0, HERO_H);
    wrap.style.setProperty("--wrap-offset", offset + "px");
  };

  let ticking=false;
  window.addEventListener("scroll", ()=>{
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(()=>{ ticking=false; update(); });
  },{passive:true});

  window.addEventListener("resize", update);
  update();
});


// === include_menu.js ===
document.addEventListener("DOMContentLoaded", () => {
  const placeholders = document.querySelectorAll('[data-include="menu"]');
  if (!placeholders.length) return;

  fetch('includes/menu.html')
    .then(r => r.text())
    .then(html => {
      placeholders.forEach(p => p.outerHTML = html);
    })
    .catch(()=>{});
});


// === main.20260116_16.min.js ===
!function(){"use strict";var e=document.getElementById("main-nav");if(e){var t=!1;try{t=window.matchMedia&&window.matchMedia("(hover: hover) and (pointer: fine)").matches}catch(e){}document.addEventListener("DOMContentLoaded",function(){var s;document.addEventListener("click",function(e){var t=e.target&&e.target.closest?e.target.closest("#main-nav li.has-sub > a"):null;if(t){var a=t.closest("#main-nav li.has-sub");if(a){e.preventDefault();var s=!a.classList.contains("is-open");n(a),s?(a.classList.add("is-open"),a.classList.add("hovering"),t.setAttribute("aria-expanded","true")):(a.classList.remove("is-open"),a.classList.remove("hovering"),t.setAttribute("aria-expanded","false"))}}else e.target&&e.target.closest&&e.target.closest("#main-nav")||n()}),document.addEventListener("keydown",function(e){"Escape"===e.key&&n()}),t&&e.addEventListener("mouseleave",function(){n()}),t&&a("#main-nav li.has-sub",e).forEach(function(e){var t=null;e.addEventListener("mouseenter",function(){t&&(clearTimeout(t),t=null),e.classList.add("hovering")}),e.addEventListener("mouseleave",function(){t&&clearTimeout(t),t=setTimeout(function(){e.classList.remove("hovering"),e.classList.remove("is-open")},0)})}),document.addEventListener("click",function(e){e.target&&e.target.closest&&e.target.closest("[data-to-top]")&&window.scrollTo({top:0,behavior:"smooth"})}),s=location.pathname.replace(/\/index\.html$/,"/"),a("#main-nav a, #main-nav .submenu a",document).forEach(function(e){try{var t=e.getAttribute("href");if(!t)return;if(new URL(t,location.origin).pathname.replace(/\/index\.html$/,"/")===s){e.classList.add("active");var a=e.closest(".has-sub");if(a){var n=a.querySelector(":scope > a");n&&n.classList.add("active")}}}catch(e){}})})}function a(e,t){return Array.prototype.slice.call((t||document).querySelectorAll(e))}function n(e){a("#main-nav li.has-sub.is-open",document).forEach(function(t){if(!e||t!==e){t.classList.remove("is-open"),t.classList.remove("hovering");var a=t.querySelector(":scope > a, :scope > button");a&&a.setAttribute("aria-expanded","false")}})}}();

// === notice.20260116_16.min.js ===
!function(){"use strict";function t(t,e){return(e||document).querySelector(t)}function e(t,e){return Array.prototype.slice.call((e||document).querySelectorAll(t))}function n(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function i(t){if(!t)return"";var e=String(t).match(/^(\d{4})-(\d{2})-(\d{2})/);return e?e[1]+"."+e[2]+"."+e[3]:t}async function a(t){var e=await fetch(t,{cache:"no-store"});if(!e.ok)throw new Error("Failed to load JSON: "+e.status);return await e.json()}function r(t){try{return new URLSearchParams(location.search).get(t)}catch(t){return null}}function o(t){return String(t||"").toLowerCase().trim()}function c(e){var c=e.getAttribute("data-json")||"../../data/notices.json",d=t("[data-notice-list]",e),l=t("[data-notice-empty]",e),u=t("[data-notice-filter]",e),s=t("[data-notice-search]",e),f=t("[data-notice-sort]",e),g=t("[data-notice-more]",e),h=t("[data-notice-count]",e),p=e.getAttribute("data-category")||"",v=r("cat");!p&&v&&(p=v);var m=e.hasAttribute("data-hide-filter"),y=e.getAttribute("data-limit"),S=y?parseInt(y,10):0;(isNaN(S)||S<0)&&(S=0);var C=e.getAttribute("data-page-size"),L=C?parseInt(C,10):20;if((isNaN(L)||L<1)&&(L=20),S){g&&(g.hidden=!0),h&&(h.hidden=!0);var b=t(".notice-controls",e);b&&(b.hidden=!0)}var x=[],A=0;function E(){var t=s?o(s.value):"",e=p||(u?u.value:""),n=f?f.value:"latest",i=x.filter(function(n){return(!e||String(n.category||"")===String(e))&&function(t,e){return!e||-1!==o((t.title||"")+" "+(t.summary||"")+" "+(t.content||"")+" "+(t.category||"")).indexOf(e)}(n,t)});return i=function(t,e){var n=t.slice();return"old"===e?n.sort(function(t,e){return String(t.date||"").localeCompare(String(e.date||""))}):"title"===e?n.sort(function(t,e){return String(t.title||"").localeCompare(String(e.title||""))}):n.sort(function(t,e){return String(e.date||"").localeCompare(String(t.date||""))}),n}(i,n),i}function j(t){if(d.innerHTML="",!t||!t.length)return l.hidden=!1,h&&(h.textContent="0"),void(g&&(g.hidden=!0));l.hidden=!0;var e=t;S?e.length>S&&(e=e.slice(0,S)):(0===A&&(A=L),e=e.slice(0,A)),e.forEach(function(t){d.appendChild(function(t){var e=document.createElement("li");e.className="notice-item";var a="notice_view.html?id="+encodeURIComponent(t.id),r=n(t.category||"공지"),o=n(t.title||""),c=n(t.summary||""),d=n(i(t.date));return e.innerHTML='<a class="notice-link" href="'+a+'"><div class="notice-top"><span class="notice-badge">'+r+'</span><span class="notice-date">'+d+'</span></div><div class="notice-title">'+o+"</div>"+(c?'<div class="notice-summary">'+c+"</div>":"")+"</a>",e}(t))}),S||(h&&(h.textContent=String(t.length)),g&&(g.hidden=A>=t.length))}function w(t){S||(t&&(A=0),j(E()))}a(c).then(function(i){var a=Array.isArray(i)?i.slice():[];a=a.filter(Boolean);var r={};a.forEach(function(t){t&&t.category&&(r[t.category]=!0)});var o=Object.keys(r).sort();if(u&&(u.innerHTML='<option value="">전체</option>'+o.map(function(t){return'<option value="'+n(t)+'">'+n(t)+"</option>"}).join("")),x=a,p&&u&&(u.value=p,m)){var c=t(".notice-controls",e);c&&(c.hidden=!0)}if(!S){if(u&&!p&&u.addEventListener("change",function(){w(!0)}),s){var d=null;s.addEventListener("input",function(){d&&clearTimeout(d),d=setTimeout(function(){w(!0)},120)})}f&&f.addEventListener("change",function(){w(!0)}),g&&g.addEventListener("click",function(t){t.preventDefault(),A+=L,j(E())})}p&&u&&(u.value=p),j(E())}).catch(function(t){l&&(l.hidden=!1,l.textContent="공지 데이터를 불러오지 못했습니다. ("+t.message+")"),g&&(g.hidden=!0)})}function d(e){var o=e.getAttribute("data-json")||"../../data/notices.json",c=r("id"),d=t("[data-notice-title]",e),l=t("[data-notice-meta]",e),u=t("[data-notice-body]",e),s=t("[data-notice-back]",e),f=t("[data-notice-related]",e),g=t("[data-notice-related-list]",e),p=t("[data-notice-prev]",e),v=t("[data-notice-next]",e);s&&s.addEventListener("click",function(t){t.preventDefault(),history.length>1?history.back():location.href="index.html"}),a(o).then(function(t){var e=Array.isArray(t)?t:[],a=e.find(function(t){return t&&String(t.id)===String(c)});if(!a)return d&&(d.textContent="존재하지 않는 공지"),l&&(l.textContent=""),u&&(u.innerHTML='<p class="notice-content">요청한 공지를 찾지 못했습니다.</p>'),void(f&&(f.hidden=!0));if(d&&(d.textContent=a.title||"공지"),l&&(l.innerHTML="<span class="notice-badge">"+n(a.category||"공지")+"</span><span class="notice-date">"+n(i(a.date))+"</span>"),u&&(u.innerHTML=n(a.content||a.summary||""||"").split(/\n{2,}/).map(function(t){return'<p class="notice-content">'+t.replace(/\n/g,"<br/>")+"</p>"}).join("")),p&&v&&function(){try{var t=e.slice().filter(Boolean).sort(function(t,e){return String(e.date||"").localeCompare(String(t.date||""))}),n=t.findIndex(function(t){return t&&String(t.id)===String(a.id)});if(n>-1){var i=t[n-1],r=t[n+1];i?(p.href="notice_view.html?id="+encodeURIComponent(i.id),p.hidden=!1):p.hidden=!0,r?(v.href="notice_view.html?id="+encodeURIComponent(r.id),v.hidden=!1):v.hidden=!0}else p.hidden=!0,v.hidden=!0}catch(t){p.hidden=!0,v.hidden=!0}}();f&&g){var r=String(a.category||"공지"),o=e.filter(function(t){return t&&String(t.id)!==String(a.id)&&String(t.category||"공지")===r}).sort(function(t,e){return String(e.date||"").localeCompare(String(t.date||""))}).slice(0,3);o.length?(f.hidden=!1,g.innerHTML=o.map(function(t){return'<li class="notice-related-item"><a class="notice-related-link" href="'+("notice_view.html?id="+encodeURIComponent(t.id))+'"><span class="notice-related-title-text">'+n(t.title||"")+'</span><span class="notice-related-date">'+n(i(t.date))+"</span></a></li>"}).join("")):f.hidden=!0}}).catch(function(t){d&&(d.textContent="오류"),l&&(l.textContent=""),u&&(u.innerHTML='<p class="notice-content">데이터를 불러오지 못했습니다. ('+n(t.message)+")</p>"),f&&(f.hidden=!0)})}function l(){e("[data-notice-app]").forEach(c),e("[data-notice-view]").forEach(d)}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",l):l()}();

// === top_button.js ===

(function(){
  function findTopButtons(){
    var selectors = [
      "#toTop", "#topBtn", ".to-top", ".top-btn", ".btn-top", ".scroll-top", ".back-to-top",
      '[aria-label="맨위로"]', '[title="맨위로"]'
    ];
    var nodes = [];
    selectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(n){ nodes.push(n); });
    });
    document.querySelectorAll("a,button,div,span").forEach(function(el){
      if (el && el.textContent && el.textContent.trim() === "맨위로") nodes.push(el);
    });
    return Array.from(new Set(nodes));
  }

  document.addEventListener("DOMContentLoaded", function(){
    var btns = findTopButtons();
    if (!btns.length) return;
    btns.forEach(function(btn){
      btn.classList.add("floating-top-btn","is-visible");
      btn.addEventListener("click", function(e){
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  });
})();
