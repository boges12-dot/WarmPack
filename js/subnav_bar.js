/* subnav_bar.js
   PATCH: 세로 드롭다운 submenu 비활성화 후,
   상단 메뉴 바로 아래에 가로 서브메뉴 바를 표시
*/
(function(){
  "use strict";

  function normPath(p){
    try{
      // remove hash/query, normalize leading
      p = (p || "").split("#")[0].split("?")[0];
      return p.replace(/\/+$/,"");
    }catch(e){ return (p||""); }
  }

  function getCurrentPath(){
    return normPath(location.pathname || "");
  }

  function collectSubMenus(navRoot){
    var items = navRoot.querySelectorAll("li.has-sub");
    var map = [];
    items.forEach(function(li){
      var a = li.querySelector(":scope > a");
      var ul = li.querySelector(":scope > ul.submenu");
      if(!a || !ul) return;
      var subs = [];
      ul.querySelectorAll("a").forEach(function(sa){
        subs.push({text:(sa.textContent||"").trim(), href: sa.getAttribute("href") || "#"});
      });
      map.push({li:li, a:a, href:a.getAttribute("href")||"#", subs:subs});
    });
    return map;
  }

  function ensureBar(navEl){
    var bar = document.getElementById("subnav-bar");
    if(bar) return bar;
    bar = document.createElement("div");
    bar.id = "subnav-bar";
    bar.className = "subnav-bar";
    // insert right after nav wrapper (nav.main-nav-bar)
    var navWrap = navEl.closest("nav") || navEl.parentElement;
    if(navWrap && navWrap.parentNode){
      navWrap.parentNode.insertBefore(bar, navWrap.nextSibling);
    }else{
      navEl.parentNode.insertBefore(bar, navEl.nextSibling);
    }
    return bar;
  }

  function setCurrent(bar, currentHref){
    var links = bar.querySelectorAll("a");
    links.forEach(function(l){
      if(normPath(l.getAttribute("href")||"") === normPath(currentHref||"")){
        l.classList.add("is-current");
      }else{
        l.classList.remove("is-current");
      }
    });
  }

  function render(bar, subs){
    bar.innerHTML = "";
    if(!subs || !subs.length){
      bar.classList.remove("is-active");
      return;
    }
    subs.forEach(function(s){
      var a = document.createElement("a");
      a.href = s.href;
      a.textContent = s.text;
      bar.appendChild(a);
    });
    bar.classList.add("is-active");
  }

  function pickInitial(menuMap){
    var cur = getCurrentPath();
    // try match by submenu href first
    for(var i=0;i<menuMap.length;i++){
      var m = menuMap[i];
      for(var j=0;j<m.subs.length;j++){
        var h = m.subs[j].href || "";
        // relative paths: compare endsWith
        if(cur && h && cur.endsWith(normPath(h))){
          return {menu:m, currentHref:h};
        }
      }
    }
    // fallback: match top href
    for(var k=0;k<menuMap.length;k++){
      var mh = menuMap[k].href || "";
      if(cur && mh && cur.endsWith(normPath(mh))){
        return {menu:menuMap[k], currentHref:mh};
      }
    }
    return {menu:menuMap[0] || null, currentHref:""};
  }

  document.addEventListener("DOMContentLoaded", function(){
    var nav = document.getElementById("main-nav");
    if(!nav) return;

    var menuMap = collectSubMenus(nav);
    if(!menuMap.length) return;

    var bar = ensureBar(nav);
    var init = pickInitial(menuMap);
    if(init.menu){
      render(bar, init.menu.subs);
      setCurrent(bar, init.currentHref);
    }

    // Update on hover/focus (desktop)
    menuMap.forEach(function(m){
      m.li.addEventListener("mouseenter", function(){
        render(bar, m.subs);
        setCurrent(bar, "");
      });
      m.a.addEventListener("focus", function(){
        render(bar, m.subs);
        setCurrent(bar, "");
      });
    });

    // Also update current highlight when clicking a subnav link
    bar.addEventListener("click", function(e){
      var a = e.target.closest("a");
      if(!a) return;
      setCurrent(bar, a.getAttribute("href")||"");
    });
  });
})();