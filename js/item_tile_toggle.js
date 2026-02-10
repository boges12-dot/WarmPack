/* item_tile_toggle.js
   - Each card's "상세" toggles ONLY its own details.
   - Keep a compact "요약" block visible in the card (옵션/획득), styled like a small table.
   - When expanded, the detail panel shows FULL 옵션/획득 in the detail list as well.
*/

(function () {
  "use strict";

  function applyWeaponCardRule(tile) {
    // PATCH: 무기 카드 예시 이미지 레이아웃(옵션/획득 줄맞춤)
    if (!tile) return;

    // 버튼 숨김(상세 상시 표시)
    var btn = tile.querySelector("button.tile-btn");
    if (btn) btn.style.display = "none";

    // 카드 내부: 이미지 + 무기명만 남기기 (옵션/획득 텍스트 라인 숨김)
    var sub = tile.querySelector(".tile-sub");     // 착용 등
    if (sub) sub.style.display = "none";
    var subs = tile.querySelectorAll(".tile-sub2"); // 옵션/획득
    for (var i = 0; i < subs.length; i++) subs[i].style.display = "none";

    // 상세 패널 상시 표시
    var panel = tile.querySelector(".tile-detail");
    if (panel) {
      panel.hidden = false;
      panel.removeAttribute("hidden");
      panel.style.display = "block";
    }

    // 옵션/획득 원문 추출
    function norm(t){ return (t||"").replace(/\u00A0/g," ").trim(); }
    function stripLabel(text, label){
      var t = norm(text);
      var re = new RegExp("^" + label + "\\s*:\\s*");
      return t.replace(re,"").trim();
    }

    var optLine = "";
    var acqLine = "";
    for (var j = 0; j < subs.length; j++) {
      var t = norm(subs[j].textContent);
      if (!t) continue;
      if (t.indexOf("옵션") === 0) optLine = t;
      else if (t.indexOf("획득") === 0) acqLine = t;
    }

    var optionsText = stripLabel(optLine, "옵션"); // e.g. "타격치 : 16/17 / 추가 데미지 +5 / ..."
    var acqText = stripLabel(acqLine, "획득");

    // 상세 UL 확보
    var ul = tile.querySelector(".tile-detail .item-detail .item-spec");
    if (!ul) return;

    // 기존 내용 전부 비우고(충돌 삭제) 다시 구성
    ul.innerHTML = "";

    function addRow(label, value, blankLabel) {
      if (!value) return;
      var li = document.createElement("li");
      li.className = "spec-row";
      var sp = document.createElement("span");
      sp.textContent = blankLabel ? "" : (label || "");
      var em = document.createElement("em");
      em.textContent = value;
      li.appendChild(sp);
      li.appendChild(em);
      ul.appendChild(li);
    }

    // 옵션: " / " 기준으로 줄 분리(타격치 16/17은 원문 그대로 유지)
    if (optionsText) {
      var parts = optionsText.split("/");
      var firstAdded = false;
      for (var p = 0; p < parts.length; p++) {
        var part = norm(parts[p]);
        if (!part) continue;
        if (!firstAdded) {
          addRow("옵션", part, false);
          firstAdded = true;
        } else {
          addRow("", part, true);
        }
      }
    }

    // 획득
    if (acqText) addRow("획득", acqText, false);
  }



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


