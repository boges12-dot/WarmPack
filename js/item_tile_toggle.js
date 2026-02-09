/* item_tile_toggle.js
   - Compact item cards: show only image + item name (and tier badge if present).
   - Hide meta (옵션/획득) in the card body.
   - Show meta (옵션/획득) inside the detail panel when clicking "상세".
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
    // NOTE: 착용 정보는 사용하지 않음 (요청에 따라 삭제)
    var equip = "";
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
    if(option) addRow(ul, "옵션", option);
    if(get) addRow(ul, "획득", get);

    // Ensure closed initially
    btn.textContent = "상세";
    btn.setAttribute("aria-expanded", "false");
    detail.hidden = true;

    btn.addEventListener("click", function(e){
      e.preventDefault();
      e.stopPropagation();

      // Accordion: close any other open tiles
      document.querySelectorAll("article.tile.is-open").forEach(function(other){
        if(other !== tile) closeTile(other);
      });

      if(tile.classList.contains("is-open")){
        closeTile(tile);
      }else{
        openTile(tile);
      }
    });

    // --- Animation helpers (per-tile) ---
    function openTile(t){
      var b = t.querySelector(".tile-btn");
      var d = t.querySelector(".tile-detail");
      if(!b || !d) return;

      // If previously closed, ensure measurable
      d.hidden = false;
      d.style.maxHeight = "0px";
      d.style.opacity = "0";
      d.style.transform = "translateY(-2px)";

      // Force reflow
      void d.offsetHeight;

      t.classList.add("is-open");
      b.textContent = "접기";
      b.setAttribute("aria-expanded", "true");

      // Animate open
      var target = d.scrollHeight;
      d.style.maxHeight = target + "px";
      d.style.opacity = "1";
      d.style.transform = "translateY(0)";

      var onEnd = function(ev){
        if(ev.propertyName === "max-height"){
          // Let it grow naturally after opening
          d.style.maxHeight = "none";
          d.removeEventListener("transitionend", onEnd);
        }
      };
      d.addEventListener("transitionend", onEnd);
    }

    function closeTile(t){
      var b = t.querySelector(".tile-btn");
      var d = t.querySelector(".tile-detail");
      if(!b || !d) return;

      t.classList.remove("is-open");
      b.textContent = "상세";
      b.setAttribute("aria-expanded", "false");

      // If maxHeight is 'none', fix it to current height before collapsing
      if(d.style.maxHeight === "none" || !d.style.maxHeight){
        d.style.maxHeight = d.scrollHeight + "px";
      }

      // Force reflow
      void d.offsetHeight;

      d.style.maxHeight = "0px";
      d.style.opacity = "0";
      d.style.transform = "translateY(-2px)";

      var onEnd = function(ev){
        if(ev.propertyName === "max-height"){
          d.hidden = true;
          // cleanup
          d.style.maxHeight = "";
          d.style.opacity = "";
          d.style.transform = "";
          d.removeEventListener("transitionend", onEnd);
        }
      };
      d.addEventListener("transitionend", onEnd);
    }
  }

  function initAll(){
    var tiles = document.querySelectorAll("article.tile");
    tiles.forEach(initTile);
  }

  document.addEventListener("DOMContentLoaded", initAll);
})();
