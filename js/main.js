/* HYBRID SITE v2_3 (Desktop-first skeleton)
   - Unified header/footer injection
   - Active menu + dropdown active
   - Breadcrumb auto (#breadcrumb 존재 시)
   - Dropdown UX: hover + click toggle, outside click close, ESC close
*/

(function(){
  const NAV = [
    {
      label: "소식",
      href: "/pages/news/index.html",
      key: "news",
      dropdown: [
        { label: "공지사항", href: "/pages/news/notice.html", key: "news-notice" },
        { label: "서버 규정", href: "/pages/news/notice_rules.html", key: "news-rules" },
        { label: "업데이트", href: "/pages/news/update.html", key: "news-update" },
        { label: "이벤트", href: "/pages/news/event.html", key: "news-event" }
      ]
    },
    { label: "가이드", href: "/pages/guide/index.html", key: "guide" },
    { label: "제작", href: "/pages/craft/index.html", key: "craft" },
    { label: "클래스", href: "/pages/class/index.html", key: "class" },
    { label: "스킬", href: "/pages/skill/index.html", key: "skill" },
    { label: "아이템", href: "/pages/item/index.html", key: "item" },
    { label: "사냥터", href: "/pages/hunt/index.html", key: "hunt" },
    { label: "다운로드", href: "/pages/download/index.html", key: "download" },
    { label: "홍보", href: "/pages/promo/index.html", key: "promo" },
    { label: "커뮤니티", href: "/pages/community/index.html", key: "community" }
  ];

  const BREADCRUMB_MAP = {
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

  function normalizePath(p){
    return (p || "/").split("?")[0].split("#")[0].replace(/\/+$/, "");
  }

  function pathStartsWith(path, prefix){
    return path === prefix || path.startsWith(prefix + "/");
  }

  function detectActive(pathname){
    const p = normalizePath(pathname);
    if (p === "" || p === "/" || p === "/index.html") return { topKey: "home", subKey: null };

    if (pathStartsWith(p, "/pages/news")){
      if (p.includes("/notice_rules")) return { topKey: "news", subKey: "news-rules" };
      if (p.includes("/notice")) return { topKey: "news", subKey: "news-notice" };
      if (p.includes("/update")) return { topKey: "news", subKey: "news-update" };
      if (p.includes("/event")) return { topKey: "news", subKey: "news-event" };
      return { topKey: "news", subKey: null };
    }

    const rules = [
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
    for (const [k, pre] of rules){
      if (pathStartsWith(p, pre)) return { topKey: k, subKey: null };
    }
    return { topKey: null, subKey: null };
  }

  function buildHeader(){
    const host = document.getElementById("site-header");
    if (!host) return;

    const navHtml = NAV.map(item => {
      if (item.dropdown && item.dropdown.length){
        const dd = item.dropdown
          .map(s => `<a class="dd-link" data-nav-key="${s.key}" href="${s.href}">${s.label}</a>`)
          .join("");
        return `
          <div class="nav-item" data-nav-key="${item.key}">
            <a href="${item.href}" class="nav-link" data-nav-key="${item.key}" aria-haspopup="menu" aria-expanded="false">
              ${item.label}<span class="caret" aria-hidden="true"></span>
            </a>
            <div class="dropdown" role="menu" aria-label="${item.label} 하위 메뉴">
              ${dd}
            </div>
          </div>
        `;
      }
      return `<div class="nav-item"><a class="nav-link" data-nav-key="${item.key}" href="${item.href}">${item.label}</a></div>`;
    }).join("");

    host.innerHTML = `
      <header class="site-header">
        <div class="container">
          <div class="navbar">
            <a class="brand" href="/index.html" aria-label="홈으로">HYBRID</a>
            <nav class="nav" aria-label="주요 메뉴">
              ${navHtml}
            </nav>
          </div>
        </div>
      </header>
    `;
  }

  function setActiveStates(){
    const { topKey, subKey } = detectActive(location.pathname);
    if (!topKey) return;

    const topEl = document.querySelector(`.nav-link[data-nav-key="${topKey}"]`);
    if (topEl){
      topEl.classList.add("is-active");
      topEl.setAttribute("aria-current", "page");
    }
    if (subKey){
      const subEl = document.querySelector(`.dd-link[data-nav-key="${subKey}"]`);
      if (subEl) subEl.classList.add("is-active");
    }
  }

  function initDropdown(){
    const parents = Array.from(document.querySelectorAll(".nav-item")).filter(el => el.querySelector(".dropdown"));
    function closeAll(){
      parents.forEach(p => {
        p.classList.remove("is-open");
        const link = p.querySelector(".nav-link[aria-expanded]");
        if (link) link.setAttribute("aria-expanded", "false");
      });
    }

    parents.forEach(p => {
      const link = p.querySelector(".nav-link");
      if (!link) return;

      link.addEventListener("click", (e) => {
        if (p.classList.contains("is-open")) return; // second click navigates
        e.preventDefault();
        closeAll();
        p.classList.add("is-open");
        link.setAttribute("aria-expanded", "true");
      });

      link.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " "){
          if (!p.classList.contains("is-open")){
            e.preventDefault();
            closeAll();
            p.classList.add("is-open");
            link.setAttribute("aria-expanded", "true");
          }
        }
        if (e.key === "Escape"){
          closeAll();
          link.blur();
        }
      });

      p.addEventListener("mouseenter", () => {
        closeAll();
        p.classList.add("is-open");
        link.setAttribute("aria-expanded", "true");
      });

      p.addEventListener("mouseleave", () => {
        p.classList.remove("is-open");
        link.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-item")) closeAll();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
  }

  function buildBreadcrumb(){
    const host = document.getElementById("breadcrumb");
    if (!host) return;

    const p = normalizePath(location.pathname);
    if (p === "" || p === "/" || p === "/index.html"){
      host.textContent = "";
      return;
    }

    const parts = p.split("/").filter(Boolean);
    const crumbs = [{ label: "홈", href: "/index.html" }];
    let acc = "";

    // Skip leading "pages" in label output but keep URL accumulation.
    for (let i=0; i<parts.length; i++){
      const raw = parts[i];
      acc += "/" + raw;

      const key = raw.replace(/\.html$/i, "");
      const label = BREADCRUMB_MAP[key] || key;

      if (raw === "pages") continue;

      const isLast = (i === parts.length - 1);
      const href = isLast ? null : acc + (raw.endsWith(".html") ? "" : "/");
      crumbs.push({ label, href });
    }

    host.innerHTML = crumbs.map((c, idx) => {
      const sep = idx === 0 ? "" : `<span class="sep">›</span>`;
      if (!c.href) return `${sep}<span>${escapeHtml(c.label)}</span>`;
      return `${sep}<a href="${c.href}">${escapeHtml(c.label)}</a>`;
    }).join("");
  }

  function initFooter(){
    const host = document.getElementById("site-footer");
    if (!host) return;
    host.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="links">
            <a href="/pages/news/notice_rules.html">서버 규정</a>
            <span aria-hidden="true">|</span>
            <a href="/pages/legal/terms.html">이용약관</a>
            <span aria-hidden="true">|</span>
            <a href="/pages/legal/privacy.html">개인정보 처리방침</a>
          </div>
          <div style="margin-top:10px;">© HYBRID</div>
        </div>
      </footer>
    `;
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  buildHeader();
  initFooter();
  setActiveStates();
  initDropdown();
  buildBreadcrumb();
})();
