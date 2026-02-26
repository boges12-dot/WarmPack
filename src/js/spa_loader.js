// SPA loader for GitHub Pages (WarmPack)
// Keeps address fixed at https://boges12-dot.github.io/WarmPack/ and loads subpages via fetch into #app-content.
(() => {
  const BASE_URL = "https://boges12-dot.github.io/WarmPack/";
  const APP_ID = "app-content";
  const HOME_ID = "home-content-template";

  function isInternalLink(href) {
    if (!href) return false;
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return false;
    if (href.startsWith("#")) return true;
    try {
      const u = new URL(href, window.location.href);
      return u.origin === window.location.origin;
    } catch(e) {
      return false;
    }
  }

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

  function resolveAttr(urlStr, pageUrl) {
    if (!urlStr) return urlStr;
    if (urlStr.startsWith("data:") || urlStr.startsWith("blob:")) return urlStr;
    if (urlStr.startsWith("#")) return urlStr;
    try {
      return new URL(urlStr, pageUrl).href;
    } catch(e) {
      return urlStr;
    }
  }

  function rewriteRelativeUrls(rootEl, pageUrl) {
    const attrList = [
      ["img", "src"],
      ["source", "src"],
      ["a", "href"],
      ["link", "href"],
      ["script", "src"],
    ];
    for (const [sel, attr] of attrList) {
      rootEl.querySelectorAll(sel).forEach(el => {
        const v = el.getAttribute(attr);
        if (!v) return;
        if (sel === "a" && v.startsWith("#")) return;
        el.setAttribute(attr, resolveAttr(v, pageUrl));
      });
    }
  }

  function getHomeTemplateHtml() {
    const tpl = document.getElementById(HOME_ID);
    return tpl ? tpl.innerHTML : "";
  }

  function setAppHtml(html) {
    const app = document.getElementById(APP_ID);
    if (!app) return;
    app.innerHTML = html;
    window.scrollTo(0, 0);
  }

  async function loadPage(targetPath) {
    if (!targetPath || targetPath === "index.html" || targetPath === "/" ) {
      document.title = "WarmPack";
      setAppHtml(getHomeTemplateHtml());
      return;
    }

    const pageUrl = new URL(targetPath, BASE_URL).href;
    const res = await fetch(pageUrl, { cache: "no-cache" });
    if (!res.ok) {
      setAppHtml(`<div style="padding:16px">페이지를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.<br><small>${pageUrl}</small></div>`);
      throw new Error("Failed to load: " + pageUrl);
    }
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    let content = doc.querySelector("main");
    if (!content) content = doc.body;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = content.innerHTML;

    rewriteRelativeUrls(wrapper, pageUrl);

    wrapper.querySelectorAll("a").forEach(a => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (!isInternalLink(href)) return;
      const u = new URL(href, pageUrl);
      if (looksLikeHtmlPath(u.pathname)) {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const t = normalizeTargetFromHref(u.href);
          sessionStorage.setItem("spa_last_target", t);
          loadPage(t).catch((err)=>{console.error(err); window.location.href = u.href;});
        });
      }
    });

    const t = doc.querySelector("title");
    if (t && t.textContent) document.title = t.textContent;

    setAppHtml(wrapper.innerHTML);
  }

  function bindNavInterception() {
    document.querySelectorAll("a").forEach(a => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (!isInternalLink(href)) return;
      const u = new URL(href, window.location.href);
      if (!looksLikeHtmlPath(u.pathname)) return;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const t = normalizeTargetFromHref(u.href);
        sessionStorage.setItem("spa_last_target", t);
        loadPage(t).catch((err)=>{console.error(err); window.location.href = u.href;});
      });
    });
  }

  function boot() {
    const target = sessionStorage.getItem("spa_target") || sessionStorage.getItem("spa_last_target");
    if (target) {
      sessionStorage.removeItem("spa_target");
      loadPage(target).catch((err)=>{console.error(err);});
    }
    bindNavInterception();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
