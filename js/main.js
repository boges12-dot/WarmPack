/* WarmPack GitHub Pages build
   - Base path fixed to "/WarmPack"
   - Works on https://boges12-dot.github.io/WarmPack/
*/

(function(){
  var ROOT = "/WarmPack";
  function U(path){ return ROOT + path; } // path must start with "/"

  var NAV = [
    {
      label: "소식",
      href: U("/pages/news/index.html"),
      key: "news",
      dropdown: [
        { label: "공지사항", href: U("/pages/news/notice.html"), key: "news-notice" },
        { label: "서버 규정", href: U("/pages/news/notice_rules.html"), key: "news-rules" },
        { label: "업데이트", href: U("/pages/news/update.html"), key: "news-update" },
        { label: "이벤트", href: U("/pages/news/event.html"), key: "news-event" }
      ]
    },
    { label: "가이드", href: U("/pages/guide/index.html"), key: "guide" },
    { label: "제작", href: U("/pages/craft/index.html"), key: "craft" },
    { label: "클래스", href: U("/pages/class/index.html"), key: "class" },
    { label: "스킬", href: U("/pages/skill/index.html"), key: "skill" },
    { label: "아이템", href: U("/pages/item/index.html"), key: "item" },
    { label: "사냥터", href: U("/pages/hunt/index.html"), key: "hunt" },
    { label: "다운로드", href: U("/pages/download/index.html"), key: "download" },
    { label: "홍보", href: U("/pages/promo/index.html"), key: "promo" },
    { label: "커뮤니티", href: U("/pages/community/index.html"), key: "community" }
  ];

  var BREADCRUMB_MAP = {
    "news": "소식",
    "notice": "공지사항",
    "notice_rules": "서버 규정",
    "update": "업데이트",
    "event": "이벤트",
    "guide": "가이드",
    "craft": "제작",
    "class": "클래스",
    "skill": "스킬",
    "item": "아이템",
    "hunt": "사냥터",
    "download": "다운로드",
    "promo": "홍보",
    "community": "커뮤니티",
    "legal": "법적 문서",
    "terms": "이용약관",
    "privacy": "개인정보 처리방침",
    "index": "목차"
  };

  function normalizePath(p){ return (p||"/").split("?")[0].split("#")[0].replace(/\/+$/, ""); }
  function pathStartsWith(path, prefix){ return path === prefix || path.startsWith(prefix + "/"); }

  function detectActive(pathname){
    var p = normalizePath(pathname);
    // Make relative to ROOT
    var rel = p.startsWith(ROOT) ? p.slice(ROOT.length) : p;

    if (rel === "" || rel === "/" || rel === "/index.html") return { topKey: "home", subKey: null };

    if (pathStartsWith(rel, "/pages/news")){
      if (rel.includes("/notice_rules")) return { topKey: "news", subKey: "news-rules" };
      if (rel.includes("/notice")) return { topKey: "news", subKey: "news-notice" };
      if (rel.includes("/update")) return { topKey: "news", subKey: "news-update" };
      if (rel.includes("/event")) return { topKey: "news", subKey: "news-event" };
      return { topKey: "news", subKey: null };
    }

    var rules = [
      ["guide", "/pages/guide"],
      ["craft", "/pages/craft"],
      ["class", "/pages/class"],
      ["skill", "/pages/skill"],
      ["item", "/pages/item"],
      ["hunt", "/pages/hunt"],
      ["download", "/pages/download"],
      ["promo", "/pages/promo"],
      ["community", "/pages/community"]
    ];
    for (var i=0;i<rules.length;i++){ var k=rules[i][0], pre=rules[i][1]; if (pathStartsWith(rel, pre)) return { topKey: k, subKey: null }; }
    return { topKey: null, subKey: null };
  }

  function buildHeader(){
    var host = document.getElementById("site-header");
    if (!host) return;

    var navHtml = NAV.map(function(item){
      if (item.dropdown && item.dropdown.length){
        var dd = item.dropdown.map(function(s){
          return '<a class="dd-link" data-nav-key="'+s.key+'" href="'+s.href+'">'+s.label+'</a>';
        }).join("");
        return ''
          + '<div class="nav-item" data-nav-key="'+item.key+'">'
          + '  <a href="'+item.href+'" class="nav-link" data-nav-key="'+item.key+'" aria-haspopup="menu" aria-expanded="false">'
          + '    '+item.label+'<span class="caret" aria-hidden="true"></span>'
          + '  </a>'
          + '  <div class="dropdown" role="menu" aria-label="'+item.label+' 하위 메뉴">'
          +       dd
          + '  </div>'
          + '</div>';
      }
      return '<div class="nav-item"><a class="nav-link" data-nav-key="'+item.key+'" href="'+item.href+'">'+item.label+'</a></div>';
    }).join("");

    host.innerHTML = ''
      + '<header class="site-header">'
      + '  <div class="container">'
      + '    <div class="navbar">'
      + '      <a class="brand" href="'+U('/index.html')+'" aria-label="홈으로">HYBRID</a>'
      + '      <nav class="nav" aria-label="주요 메뉴">'+navHtml+'</nav>'
      + '    </div>'
      + '  </div>'
      + '</header>';
  }

  function setActiveStates(){
    var a = detectActive(location.pathname);
    if (!a.topKey) return;
    var topEl = document.querySelector('.nav-link[data-nav-key="'+a.topKey+'"]');
    if (topEl){ topEl.classList.add("is-active"); topEl.setAttribute("aria-current","page"); }
    if (a.subKey){ var subEl = document.querySelector('.dd-link[data-nav-key="'+a.subKey+'"]'); if (subEl) subEl.classList.add("is-active"); }
  }

  function initDropdown(){
    var parents = Array.prototype.slice.call(document.querySelectorAll(".nav-item")).filter(function(el){ return el.querySelector(".dropdown"); });
    function closeAll(){ parents.forEach(function(p){ p.classList.remove("is-open"); var link=p.querySelector(".nav-link[aria-expanded]"); if (link) link.setAttribute("aria-expanded","false"); }); }
    parents.forEach(function(p){ 
      var link = p.querySelector(".nav-link"); if (!link) return;
      link.addEventListener("click", function(e){ if (p.classList.contains("is-open")) return; e.preventDefault(); closeAll(); p.classList.add("is-open"); link.setAttribute("aria-expanded","true"); });
      link.addEventListener("keydown", function(e){ 
        if (e.key==="Enter"||e.key===" "){ if(!p.classList.contains("is-open")){ e.preventDefault(); closeAll(); p.classList.add("is-open"); link.setAttribute("aria-expanded","true"); } }
        if (e.key==="Escape"){ closeAll(); link.blur(); }
      });
      p.addEventListener("mouseenter", function(){ closeAll(); p.classList.add("is-open"); link.setAttribute("aria-expanded","true"); });
      p.addEventListener("mouseleave", function(){ p.classList.remove("is-open"); link.setAttribute("aria-expanded","false"); });
    });
    document.addEventListener("click", function(e){ if (!e.target.closest(".nav-item")) closeAll(); });
    document.addEventListener("keydown", function(e){ if (e.key==="Escape") closeAll(); });
  }

  function buildBreadcrumb(){
    var host = document.getElementById("breadcrumb");
    if (!host) return;

    var p = normalizePath(location.pathname);
    var rel = p.startsWith(ROOT) ? p.slice(ROOT.length) : p;

    if (rel === "" || rel === "/" || rel === "/index.html"){ host.textContent=""; return; }

    var parts = rel.split("/").filter(Boolean);
    var crumbs = [{ label:"홈", href: U("/index.html") }];
    var acc = "";
    for (var i=0;i<parts.length;i++){ 
      var raw=parts[i]; acc += "/" + raw;
      var key = raw.replace(/\.html$/i,"");
      var label = BREADCRUMB_MAP[key] || key;
      if (raw === "pages") continue;
      var isLast = (i===parts.length-1);
      var href = isLast ? null : U(acc + (raw.endsWith(".html") ? "" : "/"));
      crumbs.push({ label:label, href:href });
    }
    host.innerHTML = crumbs.map(function(c, idx){
      var sep = idx===0 ? "" : '<span class="sep">›</span>';
      if (!c.href) return sep + "<span>" + escapeHtml(c.label) + "</span>";
      return sep + '<a href="'+c.href+'">' + escapeHtml(c.label) + "</a>";
    }).join("");
  }

  function initFooter(){
    var host = document.getElementById("site-footer");
    if (!host) return;
    host.innerHTML = ''
      + '<footer class="footer">'
      + '  <div class="container">'
      + '    <div class="links">'
      + '      <a href="'+U('/pages/news/notice_rules.html')+'">서버 규정</a>'
      + '      <span aria-hidden="true">|</span>'
      + '      <a href="'+U('/pages/legal/terms.html')+'">이용약관</a>'
      + '      <span aria-hidden="true">|</span>'
      + '      <a href="'+U('/pages/legal/privacy.html')+'">개인정보 처리방침</a>'
      + '    </div>'
      + '    <div style="margin-top:10px;">© HYBRID</div>'
      + '  </div>'
      + '</footer>';
  }

  function escapeHtml(str){ 
    return String(str).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  }

  buildHeader();
  initFooter();
  setActiveStates();
  initDropdown();
  buildBreadcrumb();
})();
