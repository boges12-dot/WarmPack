(function(){
  const ORDER = ["방어력","종류","옵션","재질","인챈트","획득"];
  function el(tag, cls){
    const e = document.createElement(tag);
    if(cls) e.className = cls;
    return e;
  }
  function buildSpecUL(specs){
    const ul = el("ul","item-spec");
    const keys = [];
    ORDER.forEach(k=>{ if(specs && specs[k]!==undefined && specs[k]!=="" ) keys.push(k); });
    if(specs){
      Object.keys(specs).forEach(k=>{ if(!keys.includes(k)) keys.push(k); });
    }
    keys.forEach(k=>{
      const v = specs[k];
      if(v===undefined || v===null || String(v).trim()==="") return;
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = k;
      const em = document.createElement("em");
      em.innerHTML = v;
      li.appendChild(span);
      li.appendChild(em);
      ul.appendChild(li);
    });
    return ul;
  }

  window.__tileToggle = function(btn){
    try{
      const tile = btn.closest("article.tile");
      const detail = tile.querySelector(".tile-detail");
      const expanded = btn.getAttribute("aria-expanded")==="true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if(expanded){
        detail.setAttribute("hidden","");
      } else {
        detail.removeAttribute("hidden");
      }
      return false;
    }catch(e){ return false; }
  };

  function buildTile(item){
    const art = el("article","tile" + (item.tier ? " tier-"+item.tier : ""));
    const icon = el("div","tile-icon");
    const img = document.createElement("img");
    img.alt = item.name || "";
    img.src = item.img || "";
    img.width = 80; img.height = 90;
    img.onerror = function(){ this.style.visibility="hidden"; };
    icon.appendChild(img);

    const text = el("div","tile-text");
    const title = el("div","tile-title");
    title.textContent = item.name || "";
    text.appendChild(title);

    const btn = document.createElement("button");
    btn.type="button";
    btn.className="tile-btn js-detail-toggle";
    btn.textContent="상세";
    btn.setAttribute("aria-expanded","false");
    btn.onclick = function(){ return window.__tileToggle(btn); };

    const detail = el("div","tile-detail");
    detail.setAttribute("hidden","");
    const wrap = el("div","item-detail");
    wrap.appendChild(buildSpecUL(item.specs || {}));
    detail.appendChild(wrap);

    art.appendChild(icon);
    art.appendChild(text);
    art.appendChild(btn);
    art.appendChild(detail);
    return art;
  }

  async function loadJSON(path){
    const res = await fetch(path, {cache:"no-store"});
    if(!res.ok) throw new Error("Failed to load "+path);
    return await res.json();
  }

  function fillArmorByTier(items){
    const panels = document.querySelectorAll(".tier-panel[data-tier]");
    if(!panels.length){
      const list = document.getElementById("itemList");
      items.forEach(it=> list.appendChild(buildTile(it)));
      return;
    }
    const byTier = {1:[],2:[],3:[]};
    items.forEach(it=>{
      const t = Number(it.tier||0);
      if(byTier[t]) byTier[t].push(it); else byTier[1].push(it);
    });
    panels.forEach(panel=>{
      const t = Number(panel.getAttribute("data-tier"));
      const wrap = panel.querySelector(".tile-wrap") || panel;
      wrap.innerHTML = "";
      (byTier[t]||[]).forEach(it=> wrap.appendChild(buildTile(it)));
    });
  }

  async function init(){
    const page = document.body.getAttribute("data-page");
    if(!page) return;
    if(page==="armor"){
      const items = await loadJSON("../../data/armor.json");
      fillArmorByTier(items);
    }else if(page==="weapon"){
      const items = await loadJSON("../../data/weapon.json");
      const list = document.getElementById("itemList");
      list.innerHTML = "";
      items.forEach(it=> list.appendChild(buildTile(it)));
    }else if(page==="maan"){
      const items = await loadJSON("../../data/maan.json");
      const list = document.getElementById("itemList");
      list.innerHTML = "";
      items.forEach(it=> list.appendChild(buildTile(it)));
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
