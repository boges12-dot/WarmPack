/* item_tile_toggle.js
   - Compact item cards: show only image + item name (and tier badge if present).
   - Hide meta (착용/옵션/획득) in the card body.
   - Show meta inside the detail panel when clicking "상세".
   - Works with current markup: .tile / .tile-btn / .tile-detail / .tile-sub / .tile-sub2
*/
(function () {
  "use strict";

  function norm(t){ return (t||"").replace(/\u00A0/g," ").trim(); }

  function stripPrefix(text, label){
    var t = norm(text);
    if(!t) return "";
    var re = new RegExp("^\\s*" + label + "\\s*:\\s*", "i");
    return t.replace(re,"").trim();
  }

  function ensureSpecList(detail){
    var itemDetail = detail.querySelector(":scope > .item-detail");
    if(!itemDetail){
      itemDetail = document.createElement("div");
      itemDetail.className = "item-detail";
      detail.insertBefore(itemDetail, detail.firstChild);
    }
    var ul = itemDetail.querySelector("ul.item-spec");
    if(!ul){
      ul = document.createElement("ul");
      ul.className = "item-spec";
      itemDetail.appendChild(ul);
    }
    return ul;
  }

  function addRow(ul, key, val){
    var li = document.createElement("li");
    li.className = "spec-row";
    var s = document.createElement("span");
    s.textContent = key;
    var em = document.createElement("em");
    em.textContent = val || "-";
    li.appendChild(s);
    li.appendChild(em);
    ul.appendChild(li);
  }

  function initTile(tile){
    var btn = tile.querySelector(".tile-btn");
    var detail = tile.querySelector(".tile-detail");
    var textCol = tile.querySelector(".tile-text");
    if(!btn || !detail || !textCol) return;

    // Collect meta
    var equipEl = textCol.querySelector(".tile-sub");
    var sub2Els = Array.prototype.slice.call(textCol.querySelectorAll(".tile-sub2"));

    var equip = equipEl ? stripPrefix(equipEl.textContent, "착용") : "";
    var option = "";
    var get = "";

    sub2Els.forEach(function(el){
      var t = norm(el.textContent);
      if(/^옵션\s*:/.test(t)) option = stripPrefix(t, "옵션");
      else if(/^획득\s*:/.test(t)) get = stripPrefix(t, "획득");
    });

    // Remove visible meta (leave only title line)
    if(equipEl) equipEl.remove();
    sub2Els.forEach(function(el){ el.remove(); });

    // Build detail spec rows
    var ul = ensureSpecList(detail);
    ul.innerHTML = "";
    if(equip) addRow(ul, "착용", equip);
    if(option) addRow(ul, "옵션", option);
    if(get) addRow(ul, "획득", get);

    // Ensure closed initially
    btn.textContent = "상세";
    btn.setAttribute("aria-expanded", "false");
    detail.hidden = true;

    btn.addEventListener("click", function(e){
      e.preventDefault();
      e.stopPropagation();
      var open = !detail.hidden;
      detail.hidden = open;
      btn.textContent = open ? "상세" : "접기";
      btn.setAttribute("aria-expanded", String(!open));
    });
  }

  function initAll(){
    var tiles = document.querySelectorAll("article.tile");
    tiles.forEach(initTile);
  }

  document.addEventListener("DOMContentLoaded", initAll);
})();
