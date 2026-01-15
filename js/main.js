(function(){
  /**
   * Hybrid Site Common JS (Desktop baseline)
   * - Inject header/footer partials
   * - Dropdown toggle (click) + alignment
   * - Active menu highlighting (including hash anchors)
   */

  function getBasePrefix(){
    try{
      return window.location.pathname.includes('/pages/') ? '../' : '';
    }catch(e){
      return '';
    }
  }

  async function injectPartial(targetId, partialPath){
    const el = document.getElementById(targetId);
    if(!el) return false;

    const base = getBasePrefix();
    const url = base + partialPath;

    const res = await fetch(url, {cache:'no-store'});
    if(!res.ok) return false;

    let html = await res.text();
    html = html.replaceAll('{{BASE}}', base);
    el.innerHTML = html;
    return true;
  }

  function closeAllDropdowns(exceptItem){
    document.querySelectorAll('.nav-item.has-sub.is-open').forEach(item=>{
      if(exceptItem && item === exceptItem) return;
      item.classList.remove('is-open');
      const btn = item.querySelector(':scope > .nav-btn');
      if(btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function initDropdownToggle(){
    const items = [...document.querySelectorAll('.nav-item.has-sub')];
    if(!items.length) return;

    items.forEach(item=>{
      const btn = item.querySelector(':scope > .nav-btn');
      const sub = item.querySelector(':scope > .sub');
      if(!btn || !sub) return;

      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();

        const isOpen = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        // Close others
        if(isOpen) closeAllDropdowns(item);

        // Align on open
        if(isOpen) alignDropdown(item);
      });

      // Click inside sub should not close immediately (except when navigating away)
      sub.addEventListener('click', (e)=>{
        e.stopPropagation();
      });
    });

    // Close on outside click
    document.addEventListener('click', ()=>{
      closeAllDropdowns(null);
    });

    // Close on ESC
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') closeAllDropdowns(null);
    });
  }

  function alignDropdown(item){
    const sub = item.querySelector(':scope > .sub');
    if(!sub) return;

    // If hidden, temporarily show to measure
    const wasHidden = getComputedStyle(sub).display === 'none';
    if(wasHidden){
      sub.style.display = 'block';
      sub.style.visibility = 'hidden';
    }

    sub.classList.remove('align-right');

    const rect = sub.getBoundingClientRect();
    const overflowRight = rect.right > (window.innerWidth - 10);
    if(overflowRight) sub.classList.add('align-right');

    if(wasHidden){
      sub.style.display = '';
      sub.style.visibility = '';
    }
  }

  function initDropdownAlignment(){
    const items = [...document.querySelectorAll('.nav-item.has-sub')];
    if(!items.length) return;

    // Re-align on resize
    window.addEventListener('resize', ()=>{
      items.forEach(alignDropdown);
    });

    // Align on hover open
    items.forEach(item=>{
      item.addEventListener('mouseenter', ()=>alignDropdown(item));
    });
  }

  function normalizePathname(pathname){
    return (pathname || '').replace(/\/+$/, '');
  }

  function setActiveMenu(){
    const links = [...document.querySelectorAll('#mainNav a.nav-link, #mainNav .sub a')];
    if(!links.length) return;

    const currentUrl = new URL(window.location.href);
    const currentPath = normalizePathname(currentUrl.pathname);
    const currentHash = currentUrl.hash || '';

    // clear
    document.querySelectorAll('#mainNav .active').forEach(el=>el.classList.remove('active'));
    document.querySelectorAll('#mainNav .is-active').forEach(el=>el.classList.remove('is-active'));

    let best = null;

    for(const a of links){
      const href = a.getAttribute('href') || '';
      if(!href || href.startsWith('http')) continue;

      const u = new URL(href, window.location.href);
      const path = normalizePathname(u.pathname);

      if(path !== currentPath) continue;

      const hash = u.hash || '';
      if(currentHash && hash && currentHash === hash){
        best = a;
        break;
      }

      // If same path and no better match yet, remember it
      if(!best) best = a;

      // Prefer exact match when no hash
      if(!currentHash && !hash){
        best = a;
      }
    }

    if(best){
      best.classList.add('active');
      const parentItem = best.closest('.nav-item');
      if(parentItem) parentItem.classList.add('is-active');
      const parentSubItem = best.closest('.nav-item.has-sub');
      if(parentSubItem) parentSubItem.classList.add('is-active');
    }
  }

  async function boot(){
    await injectPartial('siteHeader', 'partials/header.html');
    await injectPartial('siteFooter', 'partials/footer.html');

    initDropdownToggle();
    initDropdownAlignment();
    setActiveMenu();

    window.addEventListener('hashchange', setActiveMenu);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }
})();