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

  
  function normalizeDetailBox(tile){
    const detail = tile.querySelector('.tile-detail');
    if(!detail) return;
    // Remove duplicated option/acquire blocks outside the main spec list
    detail.querySelectorAll('.kv').forEach(kv=>{
      const k = kv.querySelector('.k')?.textContent?.trim();
      if(k==='옵션' || k==='획득') kv.remove();
    });

    // Ensure there is an item-detail box and item-spec list
    let box = detail.querySelector('.item-detail');
    if(!box){
      box = document.createElement('div');
      box.className = 'item-detail';
      const ul = document.createElement('ul');
      ul.className = 'item-spec';
      box.appendChild(ul);
      // Put the spec box at the top of the detail area
      detail.prepend(box);
    }
    let ul = box.querySelector('.item-spec');
    if(!ul){
      ul = document.createElement('ul');
      ul.className = 'item-spec';
      box.appendChild(ul);
    }

    // If there are remaining .kv rows (legacy layout), move them into the spec list
    Array.from(detail.querySelectorAll(':scope > .kv')).forEach(kv=>{
      const k = kv.querySelector('.k')?.textContent?.trim();
      const v = kv.querySelector('.v')?.textContent?.trim();
      if(!k) return;
      const li = document.createElement('li');
      li.innerHTML = `<span>${k}</span><b>${v || '-'}</b>`;
      ul.appendChild(li);
      kv.remove();
    });
  }

function applySummaryAndDetailSync(tile){
    // Make sure the expanded "block" exists and remove duplicated option/acquire blocks
    normalizeDetailBox(tile);

    const title = tile.querySelector('.tile-lines h3')?.textContent?.trim();
    if(!title) return;

    // Prefer the structured data if present, otherwise fall back to the existing summary lines
    const data = (window.ARMOR_DATA && window.ARMOR_DATA[title]) ? window.ARMOR_DATA[title] : null;

    let optText = '';
    let acqText = '';

    if(data){
      optText = Array.isArray(data.options) ? data.options.join(', ') : (data.options || '');
      acqText = data.acquire || '';
    }else{
      // Fallback: read from the (now hidden) summary lines
      const tileSub2 = tile.querySelector('.tile-sub2');
      if(tileSub2){
        const lines = tileSub2.textContent.split('\n').map(s=>s.trim()).filter(Boolean);
        // expected like: ["옵션: ...", "획득: ..."]
        const optLine = lines.find(l=>l.startsWith('옵션:'));
        const acqLine = lines.find(l=>l.startsWith('획득:'));
        optText = optLine ? optLine.replace(/^옵션:\s*/,'') : '';
        acqText = acqLine ? acqLine.replace(/^획득:\s*/,'') : '';
      }
    }

    const ul = tile.querySelector('.tile-detail .item-detail .item-spec');
    if(!ul) return;

    // helper to set or create a row in the spec list
    const upsertRow = (key, value) => {
      const rows = Array.from(ul.querySelectorAll('li'));
      let row = rows.find(li => li.querySelector('span')?.textContent?.trim() === key);
      if(!row){
        row = document.createElement('li');
        row.innerHTML = `<span>${key}</span><b>${value || '-'}</b>`;
        ul.appendChild(row);
      }else{
        const b = row.querySelector('b');
        if(b) b.textContent = value || '-';
      }
    };

    // Put "옵션" and "획득" inside the block
    if(optText) upsertRow('옵션', optText); else upsertRow('옵션', '-');
    if(acqText) upsertRow('획득', acqText); else upsertRow('획득', '-');
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
