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
    // 무기 페이지 카드: 이미지 + 무기명만 표시
    // 착용/옵션/획득은 상세(.tile-detail) 안에 줄맞춤 형식으로 구성
    if (!tile) return;

    var btn = tile.querySelector("button.tile-btn");
    if (btn) btn.style.display = "none";

    var panel = tile.querySelector(".tile-detail");
    if (panel) {
      panel.hidden = false;
      panel.removeAttribute("hidden");
    }

    // 카드 본문에 있는 텍스트 라인 숨김(타이틀은 유지)
    var sub = tile.querySelector(".tile-sub");
    if (sub) sub.style.display = "none";
    var subs = tile.querySelectorAll(".tile-sub2");
    for (var i = 0; i < subs.length; i++) subs[i].style.display = "none";

    var wearText = sub ? stripLabel(sub.textContent, "착용") : "";

    var optLine = "";
    var acqLine = "";
    for (var j = 0; j < subs.length; j++) {
      var t = normalizeText(subs[j].textContent);
      if (!t) continue;
      if (t.indexOf("옵션") === 0) optLine = t;
      else if (t.indexOf("획득") === 0) acqLine = t;
    }

    var optionsText = stripLabel(optLine, "옵션");
    var acqText = stripLabel(acqLine, "획득");

    // 상세 UL 찾기
    var ul = tile.querySelector(".tile-detail .item-detail .item-spec");
    if (!ul) return;

    // 기존 li 정리(옵션/획득/착용 관련만)
    var old = ul.querySelectorAll("li.spec-opt, li.spec-acq, li.spec-eq");
    for (var k = 0; k < old.length; k++) old[k].remove();

    function addRow(cls, label, value) {
      if (!value) return;
      var li = document.createElement("li");
      li.className = cls;
      var sp = document.createElement("span");
      sp.textContent = label || "";
      var em = document.createElement("em");
      em.textContent = value;
      li.appendChild(sp);
      li.appendChild(em);
      ul.appendChild(li);
    }

    // 착용
    addRow("spec-extra spec-eq", "착용", wearText);

    // 옵션: " / " 기준으로 줄 분리, 첫 줄만 라벨 '옵션'
    if (optionsText) {
      var parts = optionsText.split("/");
      for (var p = 0; p < parts.length; p++) {
        var part = normalizeText(parts[p]);
        if (!part) continue;
        if (p === 0) addRow("spec-opt", "옵션", part);
        else addRow("spec-opt", "", part);
      }
    }

    // 획득
    addRow("spec-extra spec-acq", "획득", acqText);
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
