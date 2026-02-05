/* item_tile_toggle.js - per-card detail toggle */
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.js-detail-toggle, .tile-btn');
    if (!btn) return;

    var tile = btn.closest('.tile');
    if (!tile) return;

    var detail = tile.querySelector('.tile-detail');
    if (!detail) return;

    var expanded = btn.getAttribute('aria-expanded') === 'true';

    // Toggle only this card
    btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    detail.hidden = expanded;

    // Button label (optional)
    if (btn.textContent) btn.textContent = expanded ? '상세' : '접기';
  });
})();