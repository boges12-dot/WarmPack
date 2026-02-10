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
    // 1) 카드 본문(.tile-text) 숨김 -> 이미지+무기명만 노출
    var textCol = tile.querySelector(".tile-text");
    if (textCol) textCol.style.display = "none";

    // 2) 옵션/획득 값을 기존 카드 요약에서 읽어 상세로 이동
    //    (기존 마크업: .tile-bottom > .tile-sub2 2개 라인)
    var opt = "";
    var acq = "";

    var bottom = tile.querySelector(".tile-bottom");
    if (bottom) {
      var lines = bottom.querySelectorAll(".tile-sub2");
      lines.forEach(function (el) {
        var t = normalizeText(el.textContent);
        if (t.indexOf("옵션") === 0) opt = stripLabel(t, "옵션");
        if (t.indexOf("획득") === 0) acq = stripLabel(t, "획득");
      });
      // 카드 안에서는 더 이상 필요 없으니 제거 (카드가 숨김이라도 중복 방지)
      bottom.remove();
    }

    // 3) 상세 패널에 옵션/획득을 반드시 표시
    var detail = tile.querySelector(".tile-detail");
    if (detail) {
      // detail 내부에 ul.item-spec이 이미 있음
      var ul = detail.querySelector("ul.item-spec");
      ensureSpecRow(ul, "옵션", opt);
      ensureSpecRow(ul, "획득", acq);
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

      // 초기: 열림(상시 표시)
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");

      // 토글 버튼은 숨김 (상세 패널을 항상 보여주기 위함)
      btn.style.display = "none";
});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWeaponTiles);
  } else {
    initWeaponTiles();
  }
})();
