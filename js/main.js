// hybrid_site_v2_2 - minimal UX helpers (dropdown only)
(function () {
  "use strict";

  function closeAllDropdowns(except) {
    document.querySelectorAll('.nav-item.has-sub.is-open').forEach(function (el) {
      if (except && el === except) return;
      el.classList.remove('is-open');
      var btn = el.querySelector('.nav-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleDropdown(item) {
    var isOpen = item.classList.contains('is-open');
    closeAllDropdowns(item);
    if (!isOpen) {
      item.classList.add('is-open');
      var btn = item.querySelector('.nav-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
      item.classList.remove('is-open');
      var btn2 = item.querySelector('.nav-toggle');
      if (btn2) btn2.setAttribute('aria-expanded', 'false');
    }
  }

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest && e.target.closest('.nav-item.has-sub .nav-toggle');
    if (toggle) {
      e.preventDefault();
      var item = toggle.closest('.nav-item.has-sub');
      if (item) toggleDropdown(item);
      return;
    }
    // click outside -> close
    if (!e.target.closest || !e.target.closest('.nav-item.has-sub')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllDropdowns();
  });
})();
