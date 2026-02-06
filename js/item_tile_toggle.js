/* item_tile_toggle.js
   - Each card's "상세" toggles ONLY its own details.
   - ALSO: move summary "옵션/획득" (tile-sub2) into expanded panel (tile-extra)
   - If cards are rendered dynamically, observe DOM and apply when tiles appear.
*/
(function(){
  function safeText(el){ return (el && el.textContent ? el.textContent.trim() : ""); }

  function ensureExtraSection(tile){
    if(!tile || tile.dataset.extraMoved === "1") return;
    const sub2 = tile.querySelector('.tile-sub2');
    const detail = tile.querySelector('.tile-detail');
    if(!detail) return;

    // Capture from summary (preferred)
    let optText = "";
    let getText = "";
    if(sub2){
      const lines = sub2.querySelectorAll('div');
      if(lines[0]) optText = safeText(lines[0]);
      if(lines[1]) getText = safeText(lines[1]);
    }

    // Capture from detail rows as fallback
    const kv = detail.querySelector('.kv');
    if(kv){
      kv.querySelectorAll('.kv-row').forEach(row=>{
        const k = safeText(row.querySelector('.k'));
        const v = safeText(row.querySelector('.v'));
        if(!optText && k === '옵션') optText = v;
        if(!getText && (k === '획득' || k === '획득 방법')) getText = v;
      });
    }

    // Build extra block
    const extra = document.createElement('div');
    extra.className = 'tile-extra';

    function addRow(label, value){
      if(!value) return;
      const row = document.createElement('div');
      row.className = 'tile-extra-row';
      const l = document.createElement('div');
      l.className = 'tile-extra-label';
      l.textContent = label;
      const val = document.createElement('div');
      val.className = 'tile-extra-value';
      // Preserve multi-line formatting if commas or line breaks
      val.textContent = value;
      row.appendChild(l);
      row.appendChild(val);
      extra.appendChild(row);
    }

    addRow('옵션', optText);
    addRow('획득', getText);

    if(extra.childElementCount){
      detail.appendChild(extra);
      // Remove original summary block to avoid duplication inside expanded
      if(sub2) sub2.remove();
      // Remove duplicate rows in kv (옵션/획득) if present to avoid double display
      if(kv){
        kv.querySelectorAll('.kv-row').forEach(row=>{
          const k = safeText(row.querySelector('.k'));
          if(k === '옵션' || k === '획득' || k === '획득 방법') row.remove();
        });
      }
      tile.dataset.extraMoved = "1";
    }
  }

  function processAll(root){
    const scope = root || document;
    scope.querySelectorAll('.item-tile').forEach(ensureExtraSection);
  }

  function setupObserver(){
    const obs = new MutationObserver(muts=>{
      let touched = false;
      for(const m of muts){
        if(m.addedNodes && m.addedNodes.length){
          touched = true;
          // process only added nodes for efficiency
          m.addedNodes.forEach(n=>{
            if(!(n instanceof HTMLElement)) return;
            if(n.classList && n.classList.contains('item-tile')) ensureExtraSection(n);
            else processAll(n);
          });
        }
      }
      if(touched) { /* no-op */ }
    });
    obs.observe(document.body, {childList:true, subtree:true});
  }

  document.addEventListener('DOMContentLoaded', function(){
    processAll(document);
    setupObserver();
    // Also re-process on tier tab clicks if any
    document.addEventListener('click', function(e){
      const btn = e.target.closest && e.target.closest('[data-tier],[data-filter],[data-tab]');
      if(btn) setTimeout(()=>processAll(document), 50);
    });
  });
})();
