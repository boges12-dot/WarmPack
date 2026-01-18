(() => {
  const isMobile = window.matchMedia("(max-width: 1024px)").matches;
  if (!isMobile) return;

  const body = document.body;
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const backdrop = document.querySelector('.nav-backdrop');

  if (!btn || !nav || !backdrop) return;

  const setOpen = (open) => {
    body.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };

  btn.addEventListener('click', () => setOpen(!body.classList.contains('nav-open')));
  backdrop.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Accordion: click on parent items toggles submenu
  nav.querySelectorAll('li.has-sub > a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const li = a.parentElement;
      const isOpen = li.classList.contains('open');
      // close siblings
      li.parentElement.querySelectorAll(':scope > li.has-sub.open').forEach(sib => {
        if (sib !== li) sib.classList.remove('open');
      });
      li.classList.toggle('open', !isOpen);
    });
  });

  // Close menu when clicking a leaf link
  nav.querySelectorAll('li:not(.has-sub) > a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });
})();
