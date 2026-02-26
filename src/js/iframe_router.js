// Iframe router for GitHub Pages WarmPack
// Address stays fixed at https://boges12-dot.github.io/WarmPack/
(() => {
  const BASE_URL = "https://boges12-dot.github.io/WarmPack/";
  const IFRAME_ID = "page-frame";

  function looksLikeHtmlPath(pathname) {
    return pathname.endsWith(".html") || pathname.includes("/pages/");
  }

  function normalizeTargetFromHref(href) {
    const u = new URL(href, window.location.href);
    let p = u.pathname;
    if (p.startsWith("/WarmPack/")) p = p.slice("/WarmPack/".length);
    else if (p === "/WarmPack" || p === "/WarmPack/") p = "index.html";
    else if (p.startsWith("/")) p = p.slice(1);
    if (!p) p = "index.html";
    return p + (u.search || "");
  }

  function setViewMode(isPage) {
    document.body.classList.toggle("view-page", !!isPage);
    const frame = document.getElementById(IFRAME_ID);
    if (frame) frame.style.display = isPage ? "block" : "none";
  }

  function setFrameSrc(target) {
    const frame = document.getElementById(IFRAME_ID);
    if (!frame) return;
    const url = new URL(target, BASE_URL).href;
    frame.src = url;
    sessionStorage.setItem("iframe_last_target", target);
    setViewMode(target && target !== "index.html");
  }

  function resizeFrame() {
    const frame = document.getElementById(IFRAME_ID);
    if (!frame || frame.style.display === "none") return;
    try {
      const doc = frame.contentDocument;
      if (!doc) return;
      const h = Math.max(doc.documentElement.scrollHeight || 0, doc.body?.scrollHeight || 0);
      frame.style.height = Math.max(700, h) + "px";
    } catch (e) {}
  }

  function bindLinks() {
    document.querySelectorAll("a").forEach(a => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
      if (href.startsWith("#")) return;
      try {
        const u = new URL(href, window.location.href);
        if (u.origin !== window.location.origin) return;
        if (!looksLikeHtmlPath(u.pathname)) return;

        a.addEventListener("click", (e) => {
          e.preventDefault();
          const t = normalizeTargetFromHref(u.href);
          if (t === "index.html") {
            sessionStorage.removeItem("iframe_last_target");
            setViewMode(false);
            window.scrollTo(0,0);
            return;
          }
          setFrameSrc(t);
          // 드롭다운 잔상 닫기
          document.querySelectorAll(".menu-item.open, .dropdown.open, .sub-open").forEach(el=>el.classList.remove("open","sub-open"));
        });
      } catch(e) {}
    });
  }

  function boot() {
    const fromRedirect = sessionStorage.getItem("iframe_target");
    const last = sessionStorage.getItem("iframe_last_target");
    const target = fromRedirect || last;
    if (fromRedirect) sessionStorage.removeItem("iframe_target");

    const frame = document.getElementById(IFRAME_ID);
    if (frame) {
      frame.addEventListener("load", () => {
        resizeFrame();
        setTimeout(resizeFrame, 300);
        setTimeout(resizeFrame, 900);
      });
    }

    if (target && target !== "index.html") {
      setFrameSrc(target);
    } else {
      setViewMode(false);
    }

    bindLinks();
  }

  document.addEventListener("DOMContentLoaded", boot);
  window.addEventListener("resize", () => setTimeout(resizeFrame, 120));
})();
