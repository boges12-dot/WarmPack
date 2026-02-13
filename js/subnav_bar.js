
/* Subnav bar builder: replaces dropdown submenu rendering with a horizontal bar */
(function () {
  function samePath(a, b) {
    try {
      const ua = new URL(a, location.origin);
      const ub = new URL(b, location.origin);
      // normalize: remove trailing index.html
      const pa = ua.pathname.replace(/index\.html$/,'').replace(/\/$/,'');
      const pb = ub.pathname.replace(/index\.html$/,'').replace(/\/$/,'');
      return pa === pb;
    } catch (e) { return false; }
  }

  function build() {
    const nav = document.getElementById('main-nav');
    const bar = document.getElementById('subnav-bar');
    if (!nav || !bar) return;

    // hide dropdown submenus inside main nav to avoid hover conflicts
    nav.querySelectorAll('ul.submenu').forEach(ul => {
      ul.style.display = 'none';
    });

    const links = Array.from(nav.querySelectorAll('a[href]'));
    const current = location.pathname;
    let activeLink = null;

    // match best link by pathname (exact normalized)
    for (const a of links) {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) continue;
      if (samePath(href, current)) { activeLink = a; break; }
    }
    // fallback: if none, try match by prefix for section indexes
    if (!activeLink) {
      for (const a of links) {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#')) continue;
        try {
          const ua = new URL(href, location.origin);
          const p = ua.pathname.replace(/index\.html$/,'');
          if (current.indexOf(p) !== -1 && p.length > 1) { activeLink = a; break; }
        } catch (e) {}
      }
    }

    // determine active top li
    let li = activeLink ? activeLink.closest('li') : null;
    if (!li) return;

    // if clicked submenu item, use parent has-sub
    let top = li.closest('li.has-sub') || li;
    // if li itself is inside submenu, get parent has-sub
    const parentHasSub = li.closest('ul.submenu') ? li.closest('ul.submenu').closest('li.has-sub') : null;
    if (parentHasSub) top = parentHasSub;

    const submenu = top.querySelector(':scope > ul.submenu');
    if (!submenu) { bar.innerHTML = ''; bar.style.display = 'none'; return; }

    // Build horizontal list
    const items = Array.from(submenu.querySelectorAll(':scope > li > a[href]'));
    if (!items.length) { bar.innerHTML=''; bar.style.display='none'; return; }

    bar.style.display = '';
    const ul = document.createElement('ul');
    ul.className = 'subnav-list';

    items.forEach(a => {
      const li = document.createElement('li');
      const clone = a.cloneNode(true);
      // mark active
      if (samePath(clone.getAttribute('href'), current)) {
        clone.classList.add('is-active');
      }
      li.appendChild(clone);
      ul.appendChild(li);
    });

    bar.innerHTML = '';
    bar.appendChild(ul);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
