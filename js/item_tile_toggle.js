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

    // 옵션/획득은 '/' 구분자를 줄바꿈(세로)로 표시
    if((key === "옵션" || key === "획득") && val){
      var parts = String(val).split(/\s+\/\s+/).map(function(v){ return norm(v); }).filter(function(v){ return v; });
      if(parts.length){
        em.className = "spec-multiline";

        // Helper: split into (label, value) for nicer styling (옵션 전용)
        function splitOpt(line){
          var t = norm(line);
          if(!t) return {label:"", value:"", isStat:false};

          var STAT = {STR:1, DEX:1, INT:1, CON:1, WIS:1, CHA:1};

          // Case 1: '타격치 : 16/17' (or any ':')
          var idx = t.indexOf(":");
          if(idx > -1){
            var lab = norm(t.slice(0, idx));
            return {
              label: lab + " :",
              value: norm(t.slice(idx+1)),
              isStat: !!STAT[lab]
            };
          }

          // Case 2: Starts with common stats like STR/DEX/INT/CON/WIS/CHA
          var m = t.match(/^([A-Z]{2,4})\b\s*(.*)$/);
          if(m){
            return { label: m[1], value: norm(m[2]), isStat: !!STAT[m[1]] };
          }

          // Case 3: '추가 데미지 +5' / '추가 명중 +2' etc. -> first two words as label
          if(t.indexOf(" ") > -1){
            var words = t.split(/\s+/);
            if(words[0] === "추가" && words.length >= 3){
              return { label: words[0] + " " + words[1], value: words.slice(2).join(" "), isStat:false };
            }
            // Generic: first word as label, rest as value
            return { label: words[0], value: words.slice(1).join(" "), isStat:false };
          }

          return { label: t, value: "", isStat:false };
        }

        parts.forEach(function(p){
          if(key === "획득"){
            // 획득은 단순 라인 리스트로 표시
            var gd = document.createElement("div");
            gd.className = "get-line";
            gd.textContent = p;
            em.appendChild(gd);
            return;
          }

          // 옵션 라인 (키/값 스타일링)
          var sv = splitOpt(p);
          var d = document.createElement("div");
          d.className = "opt-line";

          if(sv.label){
            var k = document.createElement("span");
            k.className = "opt-key" + (sv.isStat ? " is-stat" : "");
            k.textContent = sv.label;
            d.appendChild(k);
          }

          if(sv.value){
            var v = document.createElement("span");
            v.className = "opt-val";
            appendValWithNums(v, sv.value);
            d.appendChild(v);
          }

          em.appendChild(d);
        });
      }else{
        em.textContent = "-";
      }
    } else {
      em.textContent = val || "-";
    }

    li.appendChild(s);
    li.appendChild(em);
    ul.appendChild(li);
  }

  
  function appendValWithNums(container, text){
    var t = String(text || "");
    // Highlight signed numbers like +5, -2, +10%
    var re = /([+-]\d+(?:\.\d+)?%?)/g;
    var last = 0;
    var m;
    while((m = re.exec(t)) !== null){
      if(m.index > last){
        container.appendChild(document.createTextNode(t.slice(last, m.index)));
      }
      var num = document.createElement("span");
      num.className = "opt-num";
      num.textContent = m[1];
      container.appendChild(num);
      last = m.index + m[1].length;
    }
    if(last < t.length){
      container.appendChild(document.createTextNode(t.slice(last)));
    }
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
    // Open-by-default (요청: '상세' 없이 전부 오픈 형식)
    // - Hide/remove the button
    // - Show the detail panel expanded for every tile
    tile.classList.add("is-open");

    // Remove the toggle button entirely (no click UX)
    btn.removeAttribute("aria-expanded");
    btn.removeAttribute("type");
    btn.style.display = "none";

    // Make detail visible and reset any inline animation styles
    detail.hidden = false;
    detail.style.maxHeight = "none";
    detail.style.opacity = "1";
    detail.style.transform = "none";
  }
function initAll(){
    var tiles = document.querySelectorAll("article.tile");
    tiles.forEach(initTile);
  }

  document.addEventListener("DOMContentLoaded", initAll);
})();
