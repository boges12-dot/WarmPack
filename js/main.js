
// === Smooth scroll for Back-to-Top ===
(function () {
  function bind(el) {
    if (!el) return;
    el.addEventListener("click", function (e) {
      // allow normal navigation if not top link
      const href = (el.getAttribute("href") || "").trim();
      if (href && href !== "#top" && href !== "#") return;

      e.preventDefault();
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (_) {
        window.scrollTo(0, 0);
      }
      // keep URL clean
      if (history && history.replaceState) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    });
  }

  // common selectors
  const candidates = document.querySelectorAll(
    '.floating-menu a[href*="#top"], .floating-menu .back-to-top, .floating-menu .top-btn, #backToTop, .back-to-top, .top-btn'
  );
  candidates.forEach(bind);
})();



// === Back-to-Top: show only after scrolling down ===
(function () {
  const threshold = 220;
  const els = Array.from(document.querySelectorAll(
    '.floating-menu a[href*="#top"], .floating-menu .back-to-top, .floating-menu .top-btn, #backToTop, .back-to-top, .top-btn'
  ));

  function update() {
    const y = (window.scrollY || document.documentElement.scrollTop || 0);
    const show = y > threshold;
    els.forEach(el => {
      if (!el) return;
      el.classList.toggle("is-visible", show);
      el.setAttribute("aria-hidden", show ? "false" : "true");
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("load", update);
  update();
})();

