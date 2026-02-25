/* item_tile_toggle.js
   - Each card's "상세" toggles ONLY its own details.
   - Keep a compact "요약" block visible in the card (옵션/획득), styled like a small table.
   - When expanded, the detail panel shows FULL 옵션/획득 in the detail list as well.
*/

(function () {
  "use strict";

  function normalizeText(t) {
    return (t || "").replace(/\u00A0/g, " ").trim();
  }

  // "옵션: AC +1\nDEX +1" -> "AC +1<br>DEX +1"
  function stripLabelAndFormat(text, label) {
    var t = normalizeText(text);
    if (!t) return "";
    // Remove leading "옵션:" / "획득:" (with optional spaces)
    var re = new RegExp("^" + label + "\\s*:\\s*", "i");
    t = t.replace(re, "");
    // Convert any line breaks to <br>
    return t.replace(/\r?\n/g, "<br>");
  }

  function findDetailDD(detailRoot, dtLabel) {
    if (!detailRoot) return null;
    var dts = detailRoot.querySelectorAll("dt");
    for (var i = 0; i < dts.length; i++) {
      if (normalizeText(dts[i].textContent) === dtLabel) {
        // dt -> nextElementSibling is dd
        var dd = dts[i].nextElementSibling;
        if (dd && dd.tagName && dd.tagName.toLowerCase() === "dd") return dd;
      }
    }
    return null;
  }

  function ensureDetailRow(detailRoot, dtLabel, htmlValue) {
    if (!detailRoot) return;
    var dd = findDetailDD(detailRoot, dtLabel);
    if (dd) {
      dd.innerHTML = htmlValue || "-";
      return;
    }
    // If row doesn't exist, append a new row at the end.
    var dl = detailRoot.querySelector("dl");
    if (!dl) return;
    var dt = document.createElement("dt");
    dt.textContent = dtLabel;
    var ddNew = document.createElement("dd");
    ddNew.innerHTML = htmlValue || "-";
    dl.appendChild(dt);
    dl.appendChild(ddNew);
  }

  function buildSummaryBlock(optionHTML, getHTML) {
    var wrap = document.createElement("div");
    wrap.className = "tile-summary";

    var row1 = document.createElement("div");
    row1.className = "tile-summary-row";
    var k1 = document.createElement("div");
    k1.className = "tile-summary-key";
    k1.textContent = "옵션";
    var v1 = document.createElement("div");
    v1.className = "tile-summary-val";
    v1.innerHTML = optionHTML || "-";
    row1.appendChild(k1);
    row1.appendChild(v1);

    var row2 = document.createElement("div");
    row2.className = "tile-summary-row";
    var k2 = document.createElement("div");
    k2.className = "tile-summary-key";
    k2.textContent = "획득";
    var v2 = document.createElement("div");
    v2.className = "tile-summary-val";
    v2.innerHTML = getHTML || "-";
    row2.appendChild(k2);
    row2.appendChild(v2);

    wrap.appendChild(row1);
    wrap.appendChild(row2);

    return wrap;
  }

  function applySummaryAndDetailSync(tile) {
    var sub2 = tile.querySelector(".tile-sub2");
    if (!sub2) return;

    var lines = sub2.querySelectorAll("div");
    var optRaw = lines[0] ? lines[0].textContent : "";
    var getRaw = lines[1] ? lines[1].textContent : "";

    var optionHTML = stripLabelAndFormat(optRaw, "옵션");
    var getHTML = stripLabelAndFormat(getRaw, "획득");

    // 1) Create visible summary block in the card (replaces old tile-sub2)
    var textCol = tile.querySelector(".tile-text");
    if (textCol) {
      // Place after main meta (.tile-sub) if possible
      var anchor = textCol.querySelector(".tile-sub");
      var summary = buildSummaryBlock(optionHTML, getHTML);

      // Avoid duplication if already added (re-run safe)
      var existing = textCol.querySelector(".tile-summary");
      if (existing) existing.remove();

      if (anchor && anchor.nextSibling) {
        textCol.insertBefore(summary, anchor.nextSibling);
      } else {
        textCol.appendChild(summary);
      }
    }

    // Remove old plain summary
    sub2.remove();

    // 2) When expanded, ensure the detail list shows full 옵션/획득 too
    var detail = tile.querySelector(".tile-detail .item-detail");
    if (detail) {
      ensureDetailRow(detail, "옵션", optionHTML);
      ensureDetailRow(detail, "획득", getHTML);
    }
  }

  function initTiles(root) {
    var tiles = (root || document).querySelectorAll(".item-tile");
    tiles.forEach(function (tile) {
      // Sync summary/detail from existing tile-sub2 content (if present)
      applySummaryAndDetailSync(tile);

      var btn = tile.querySelector(".detail-btn");
      var panel = tile.querySelector(".tile-detail");
      if (!btn || !panel) return;

      // Ensure closed state
      panel.style.display = "none";
      btn.setAttribute("aria-expanded", "false");

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        var isOpen = panel.style.display !== "none";
        panel.style.display = isOpen ? "none" : "block";
        btn.textContent = isOpen ? "상세" : "접기";
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTiles(document);

    // In case some pages inject tiles dynamically, observe and init new ones.
    var target = document.body;
    if (!target || !window.MutationObserver) return;

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        (m.addedNodes || []).forEach(function (node) {
          if (!node || node.nodeType !== 1) return;
          if (node.classList && node.classList.contains("item-tile")) {
            initTiles(node.parentNode || document);
          } else if (node.querySelectorAll) {
            var hasTile = node.querySelectorAll(".item-tile").length > 0;
            if (hasTile) initTiles(node);
          }
        });
      });
    });

    observer.observe(target, { childList: true, subtree: true });
  });
})();
  function normalizeDetail(tile, detail){
    if(!tile || !detail) return;
    if(tile.dataset.kvMerged === "1") return;

    // Ensure item-detail / item-spec exists
    let itemDetail = detail.querySelector(":scope > .item-detail");
    if(!itemDetail){
      itemDetail = document.createElement("div");
      itemDetail.className = "item-detail";
      const ul = document.createElement("ul");
      ul.className = "item-spec";
      itemDetail.appendChild(ul);
      // Put the spec box first inside detail
      detail.insertBefore(itemDetail, detail.firstChild);
    }
    let ul = itemDetail.querySelector("ul.item-spec");
    if(!ul){
      ul = document.createElement("ul");
      ul.className = "item-spec";
      itemDetail.appendChild(ul);
    }

    // Move bottom kv blocks (옵션/획득 등) into the spec list
    const kvs = Array.from(detail.querySelectorAll(":scope > .kv"));
    kvs.forEach(kv => {
      const kEl = kv.querySelector(".k");
      const vEl = kv.querySelector(".v");
      if(!kEl || !vEl) return;

      const li = document.createElement("li");
      const s = document.createElement("span");
      s.textContent = kEl.textContent.trim();
      const em = document.createElement("em");
      // Preserve line breaks in value
      em.innerHTML = vEl.innerHTML;
      li.appendChild(s);
      li.appendChild(em);
      ul.appendChild(li);

      kv.remove();
    });

    tile.dataset.kvMerged = "1";
  }


