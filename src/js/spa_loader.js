// SPA loader for GitHub Pages (WarmPack)
// URL stays at https://boges12-dot.github.io/WarmPack/ while swapping page body region (after nav).
(() => {
  const BASE_URL = "https://boges12-dot.github.io/WarmPack/";
  const APP_ID = "app-content";

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
    try { return new URL(urlStr, pageUrl).href; } catch(e) { return urlStr; }
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

  function setRegionHtml(html) {
    const app = document.getElementById(APP_ID);
    if (!app) return;
    app.innerHTML = html;
    window.scrollTo(0, 0);
  }

  function getRegionFromDoc(doc) {
    const nav = doc.querySelector("nav.main-nav-bar");
    if (!nav) {
      // fallback: main only
      const main = doc.querySelector("main");
      return main ? main.outerHTML : doc.body.innerHTML;
    }
    // Collect siblings after nav until end of body
    const out = document.createElement("div");
    let node = nav.nextElementSibling;
    while (node) {
      // Ignore the SPA loader script itself if present
      if (node.tagName === "SCRIPT" && (node.src || "").includes("spa_loader")) {
        node = node.nextElementSibling;
        continue;
      }
      out.appendChild(node.cloneNode(true));
      node = node.nextElementSibling;
    }
    return out.innerHTML;
  }

  async function loadPage(targetPath) {
    const t = targetPath || "index.html";
    const pageUrl = new URL(t, BASE_URL).href;

    const res = await fetch(pageUrl, { cache: "no-cache" });
    if (!res.ok) {
      setRegionHtml(`<div style="padding:16px">페이지를 불러오지 못했습니다.<br><small>${pageUrl}</small></div>`);
      throw new Error("Failed to load: " + pageUrl);
    }
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    const regionHtml = getRegionFromDoc(doc);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = regionHtml;
    rewriteRelativeUrls(wrapper, pageUrl);

    // Update title
    const tt = doc.querySelector("title");
    if (tt && tt.textContent) document.title = tt.textContent;

    setRegionHtml(wrapper.innerHTML);
    bindInterception(); // rebind links inside new region
  }

  function bindInterception() {
    document.querySelectorAll("a").forEach(a => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;

      let u;
      try { u = new URL(href, window.location.href); } catch(e) { return; }
      if (u.origin !== window.location.origin) return;
      if (!looksLikeHtmlPath(u.pathname)) return;

      a.addEventListener("click", (e) => {
        e.preventDefault();
        const target = normalizeTargetFromHref(u.href);
        sessionStorage.setItem("spa_last_target", target);
        loadPage(target).catch((err)=>{ console.error(err); window.location.href = u.href; });
      });
    });
  }

  function boot() {
    const target = sessionStorage.getItem("spa_target") || sessionStorage.getItem("spa_last_target") || "index.html";
    sessionStorage.removeItem("spa_target");
    // Only auto-load if not already on index shell content mismatch.
    if (target && target !== "index.html") {
      loadPage(target).catch(console.error);
    } else {
      bindInterception();
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
