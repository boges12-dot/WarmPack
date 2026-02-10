/* item_tile_toggle.js
   - "상세" 버튼은 해당 카드의 상세만 토글
   - 카드에는 "이미지 + 무기명"만 보이게
   - 옵션/획득 정보는 상세(상세 패널) 안에서만 표시
   - 폴더/파일명/구조 변경 없이 동작
*/

(function () {
  "use strict";

  function normalizeText(t) {
    return (t || "").replace(/\u00A0/g, " ").trim();
  }

  function stripLabel(text, label) {
    var t = normalizeText(text);
    if (!t) return "";
    var re = new RegExp("^" + label + "\\s*:\\s*", "i");
    return t.replace(re, "").trim();
  }

  function ensureSpecRow(ul, label, value) {
    if (!ul) return;
    var items = ul.querySelectorAll("li");
    for (var i = 0; i < items.length; i++) {
      var sp = items[i].querySelector("span");
      if (sp && normalizeText(sp.textContent) === label) {
        var em = items[i].querySelector("em");
        if (em) em.textContent = value || "-";
        return;
      }
    }

    var li = document.createElement("li");
    li.className = "spec-extra";
    var span = document.createElement("span");
    span.textContent = label;
    var emNew = document.createElement("em");
    emNew.textContent = value || "-";
    li.appendChild(span);
    li.appendChild(emNew);
    ul.appendChild(li);
  }

  function applyWeaponCardRule(tile) {
    // 카드에는 이미지 + 무기명만(타이틀) 유지, 상세에는 착용/옵션/획득이 이미 마크업되어 있음
    var btn = tile.querySelector("button.tile-btn");
    if (btn) btn.style.display = "none";

    var panel = tile.querySelector(".tile-detail");
    if (panel) {
      panel.hidden = false; // 항상 표시
      panel.removeAttribute("hidden");
    }
  }

  function initWeaponTiles() {
    // 무기 페이지(또는 무기 섹션) 내 카드만 적용
    var scope = document.querySelector(".item-weapon-page") || document;
    var tiles = scope.querySelectorAll("article.tile");
    tiles.forEach(applyWeaponCardRule);

    // 상세 토글
    var btns = scope.querySelectorAll("button.tile-btn");
    btns.forEach(function (btn) {
      var tile = btn.closest("article.tile");
      if (!tile) return;
      var panel = tile.querySelector(".tile-detail");
      if (!panel) return;

      // 초기: 닫힘
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWeaponTiles);
  } else {
    initWeaponTiles();
  }
})();
