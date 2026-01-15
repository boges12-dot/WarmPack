(function(){
  /**
   * Hybrid Site Common JS
   * - Inject header/footer partials
   * - Desktop nav UX: horizontal wheel scroll, dropdown alignment
   * - Active menu highlighting
   */

  function getBasePrefix(){
    // If current page is inside /pages/, we need to go up one level for shared assets/partials.
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

    const res = await fetch(url, {cache: 'no-store'});
    if(!res.ok) return false;

    let html = await res.text();
    html = html.replaceAll('{{BASE}}', base);
    el.innerHTML = html;
    return true;
  }

  function initFooterYear(){
    const y = document.getElementById('yearNow');
    if(y) y.textContent = String(new Date().getFullYear());
  }

  function initNavWheelScroll(){
    const nav = document.getElementById('mainNav');
    if(!nav) return;

    nav.addEventListener('wheel', (e)=>{
      // Allow default trackpad horizontal scroll
      if(e.shiftKey) return;

      const dx = (Math.abs(e.deltaY) > Math.abs(e.deltaX)) ? e.deltaY : e.deltaX;
      if(!dx) return;

      nav.scrollLeft += dx;
      e.preventDefault();
    }, {passive:false});
  }

  function alignDropdown(item){
    const sub = item.querySelector('.sub');
    if(!sub) return;

    const wasHidden = getComputedStyle(sub).display === 'none';
    if(wasHidden) sub.style.display = 'block';

    sub.classList.remove('align-right');

    const rect = sub.getBoundingClientRect();
    const overflowRight = rect.right > (window.innerWidth - 8);
    const overflowLeft  = rect.left < 8;

    if(overflowRight && !overflowLeft) sub.classList.add('align-right');

    if(wasHidden) sub.style.display = '';
  }

  function initDropdownAlignment(){
    const items = [...document.querySelectorAll('.nav-item.has-sub')];
    if(!items.length) return;

    items.forEach(item=>{
      item.addEventListener('mouseenter', ()=>alignDropdown(item));
      item.addEventListener('focusin',   ()=>alignDropdown(item));
    });

    window.addEventListener('resize', ()=>{
      items.forEach(item=>{
        const sub = item.querySelector('.sub');
        if(sub) sub.classList.remove('align-right');
      });
    });
  }

  function normalizePathname(pathname){
    // Remove trailing slashes
    return (pathname || '').replace(/\/+$/, '');
  }

  function setActiveMenu(){
    const links = [...document.querySelectorAll('#mainNav a.nav-link, #mainNav .sub a')];
    if(!links.length) return;

    const currentUrl = new URL(window.location.href);
    const currentPath = normalizePathname(currentUrl.pathname);
    const currentHash = currentUrl.hash || '';

    // Clear previous active
    document.querySelectorAll('#mainNav .active').forEach(el=>el.classList.remove('active'));
    document.querySelectorAll('#mainNav .is-active').forEach(el=>el.classList.remove('is-active'));

    let bestMatch = null;

    for(const a of links){
      const href = a.getAttribute('href') || '';
      if(!href || href.startsWith('http')) continue;

      const u = new URL(href, window.location.href);
      const path = normalizePathname(u.pathname);

      // Path must match first
      if(path !== currentPath) continue;

      // Prefer hash match when hash exists on both
      const hash = u.hash || '';
      if(currentHash && hash && currentHash === hash){
        bestMatch = a;
        break;
      }

      // Otherwise, keep first path match as fallback
      if(!bestMatch) bestMatch = a;
    }

    if(bestMatch){
      bestMatch.classList.add('active');

      // If it's inside dropdown, also activate parent button/item
      const parentItem = bestMatch.closest('.nav-item.has-sub');
      if(parentItem){
        parentItem.classList.add('is-active');
        const btn = parentItem.querySelector('.nav-btn');
        if(btn) btn.classList.add('active');
      }
    }else{
      // Home fallback
      const home = document.querySelector('#mainNav a.nav-link[href$="index.html"]');
      if(home && (currentPath.endsWith('/index.html') || currentPath === '' || currentPath === '/')){
        home.classList.add('active');
      }
    }
  }

  async function boot(){
    // Inject header/footer (if placeholders exist)
    await injectPartial('siteHeader', 'partials/header.html');
    await injectPartial('siteFooter', 'partials/footer.html');

    // Init common UX
    initFooterYear();
    initNavWheelScroll();
    initDropdownAlignment();
    setActiveMenu();

    // Re-evaluate active when hash changes
    window.addEventListener('hashchange', setActiveMenu);
  }

  // Run after DOM is ready (defer is already used, but this keeps it safe)
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }
})();
