/* Item tile toggle + detail normalization (prevents duplicate option/acquire blocks)
   - Collapsed view: show only icon + title
   - Expanded view: show detail block only (options/acquire are inside the block)
*/
(function () {
  "use strict";

  function textFromNode(node) {
    if (!node) return "";
    // Keep <br> as line breaks
    const clone = node.cloneNode(true);
    clone.querySelectorAll("br").forEach(br => br.replaceWith("\n"));
    return (clone.textContent || "").trim().replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n");
  }

  function setEmHTML(em, htmlStr) {
    // safe enough: htmlStr comes from existing page markup (<br> only expected)
    em.innerHTML = htmlStr;
  }

  function ensureItemDetail(tileDetail) {
    let itemDetail = tileDetail.querySelector(".item-detail");
    if (!itemDetail) {
      itemDetail = document.createElement("div");
      itemDetail.className = "item-detail";
      const ul = document.createElement("ul");
      ul.className = "item-spec";
      itemDetail.appendChild(ul);
      tileDetail.insertBefore(itemDetail, tileDetail.firstChild);
    } else if (!itemDetail.querySelector(".item-spec")) {
      const ul = document.createElement("ul");
      ul.className = "item-spec";
      itemDetail.appendChild(ul);
    }
    return itemDetail.querySelector(".item-spec");
  }

  function kvToSpecList(tileDetail) {
    const kvs = Array.from(tileDetail.querySelectorAll(".kv"));
    if (!kvs.length) return;

    const ul = ensureItemDetail(tileDetail);

    kvs.forEach(kv => {
      const kEl = kv.querySelector(".k");
      const vEl = kv.querySelector(".v");
      if (!kEl || !vEl) return;

      const key = (kEl.textContent || "").trim();
      const valueHtml = vEl.innerHTML.trim();

      // If the list already has this key, skip to avoid duplicates
      const exists = Array.from(ul.querySelectorAll("li span")).some(sp => (sp.textContent || "").trim() === key);
      if (!exists) {
        const li = document.createElement("li");
        const sp = document.createElement("span");
        sp.textContent = key;
        const em = document.createElement("em");
        setEmHTML(em, valueHtml);
        li.appendChild(sp);
        li.appendChild(em);
        ul.appendChild(li);
      }
    });

    // Remove original kv blocks to prevent duplicate outputs
    kvs.forEach(kv => kv.remove());
  }

  function ensureAcquireInside(tile) {
    const detail = tile.querySelector(".tile-detail");
    if (!detail) return;

    // acquire source: try existing spec list first, else use kv (already converted) or summary line
    const ul = ensureItemDetail(detail);

    const hasAcquire = Array.from(ul.querySelectorAll("li span"))
      .some(sp => (sp.textContent || "").trim() === "획득");

    if (hasAcquire) return;

    // try read from summary "획득: ..."
    let acquireText = "";
    const subs = tile.querySelectorAll(".tile-sub2");
    subs.forEach(el => {
      const t = (el.textContent || "").trim();
      if (t.startsWith("획득")) acquireText = t.replace(/^획득\s*:\s*/,"").trim();
    });

    if (!acquireText) return;

    const li = document.createElement("li");
    const sp = document.createElement("span");
    sp.textContent = "획득";
    const em = document.createElement("em");
    em.textContent = acquireText;
    li.appendChild(sp);
    li.appendChild(em);
    ul.appendChild(li);
  }

  function normalizeTile(tile) {
    const detail = tile.querySelector(".tile-detail");
    if (!detail) return;

    // Convert kv blocks (옵션/획득 포함) into the spec list, then remove kv blocks
    kvToSpecList(detail);

    // Ensure 획득 is present (some tiles may only have it in summary)
    ensureAcquireInside(tile);

    // Mark for minimal header layout
    tile.classList.add("tile--minimal");
  }

  function normalizeAllTiles() {
    document.querySelectorAll(".tile").forEach(normalizeTile);
  }

  function toggleTile(btn) {
    const tile = btn && btn.closest(".tile");
    if (!tile) return false;

    const detail = tile.querySelector(".tile-detail");
    if (!detail) return false;

    const isOpen = !detail.hasAttribute("hidden");
    if (isOpen) {
      detail.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "상세";
      tile.classList.remove("is-open");
    } else {
      detail.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = "접기";
      tile.classList.add("is-open");
    }
    return false;
  }

  // Expose for inline onclick
  window.__tileToggle = function (btn) {
    return toggleTile(btn);
  };

  document.addEventListener("DOMContentLoaded", function () {
    normalizeAllTiles();

    // Also attach listeners (works even if onclick removed later)
    document.querySelectorAll(".js-detail-toggle").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toggleTile(btn);
      });
    });
  });
})();
