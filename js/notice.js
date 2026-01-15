(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    // Expect YYYY-MM-DD
    var m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return iso;
    return m[1] + '.' + m[2] + '.' + m[3];
  }

  function toParagraphs(text) {
    var safe = escapeHtml(text || '');
    return safe
      .split(/\n{2,}/)
      .map(function (block) {
        return '<p class="notice-content">' + block.replace(/\n/g, '<br/>') + '</p>';
      })
      .join('');
  }

  async function fetchJson(url) {
    var res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load JSON: ' + res.status);
    return await res.json();
  }

  function initNoticeIndex(app) {
    var jsonUrl = app.getAttribute('data-json') || '../../data/notices.json';
    var listEl = $('[data-notice-list]', app);
    var emptyEl = $('[data-notice-empty]', app);
    var selEl = $('[data-notice-filter]', app);

    function render(items) {
      listEl.innerHTML = '';
      if (!items || !items.length) {
        emptyEl.hidden = false;
        return;
      }
      emptyEl.hidden = true;

      items.forEach(function (it) {
        var li = document.createElement('li');
        li.className = 'notice-item';

        var href = 'notice_view.html?id=' + encodeURIComponent(it.id);
        var cat = escapeHtml(it.category || '공지');
        var title = escapeHtml(it.title || '');
        var summary = escapeHtml(it.summary || '');
        var date = escapeHtml(formatDate(it.date));

        li.innerHTML =
          '<a class="notice-link" href="' + href + '">' +
            '<div class="notice-top">' +
              '<span class="notice-badge">' + cat + '</span>' +
              '<span class="notice-date">' + date + '</span>' +
            '</div>' +
            '<div class="notice-title">' + title + '</div>' +
            (summary ? '<div class="notice-summary">' + summary + '</div>' : '') +
          '</a>';

        listEl.appendChild(li);
      });
    }

    fetchJson(jsonUrl)
      .then(function (data) {
        var items = Array.isArray(data) ? data.slice() : [];
        items.sort(function (a, b) {
          return String(b.date || '').localeCompare(String(a.date || ''));
        });

        // Build category filter
        var cats = {};
        items.forEach(function (it) { if (it && it.category) cats[it.category] = true; });
        var catList = Object.keys(cats);
        catList.sort();

        if (selEl) {
          selEl.innerHTML = '<option value="">전체</option>' +
            catList.map(function (c) {
              return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
            }).join('');

          selEl.addEventListener('change', function () {
            var v = selEl.value;
            var filtered = !v ? items : items.filter(function (it) { return it.category === v; });
            render(filtered);
          });
        }

        render(items);
      })
      .catch(function (err) {
        if (emptyEl) {
          emptyEl.hidden = false;
          emptyEl.textContent = '공지 데이터를 불러오지 못했습니다. (' + err.message + ')';
        }
      });
  }

  function initNoticeView(root) {
    var jsonUrl = root.getAttribute('data-json') || '../../data/notices.json';
    var params = new URLSearchParams(location.search);
    var id = params.get('id');

    var titleEl = $('[data-notice-title]', root);
    var metaEl = $('[data-notice-meta]', root);
    var bodyEl = $('[data-notice-body]', root);
    var backEl = $('[data-notice-back]', root);

    if (backEl) {
      backEl.addEventListener('click', function (e) {
        e.preventDefault();
        history.length > 1 ? history.back() : (location.href = 'index.html');
      });
    }

    fetchJson(jsonUrl)
      .then(function (data) {
        var items = Array.isArray(data) ? data : [];
        var item = items.find(function (x) { return x && String(x.id) === String(id); });

        if (!item) {
          if (titleEl) titleEl.textContent = '존재하지 않는 공지';
          if (metaEl) metaEl.textContent = '';
          if (bodyEl) bodyEl.innerHTML = '<p class="notice-content">요청한 공지를 찾지 못했습니다.</p>';
          return;
        }

        if (titleEl) titleEl.textContent = item.title || '공지';
        if (metaEl) metaEl.textContent = (item.category || '공지') + ' · ' + formatDate(item.date);
        if (bodyEl) bodyEl.innerHTML = toParagraphs(item.content || item.summary || '');

        // aria-current in nav is handled in main.js already; no changes here.
      })
      .catch(function (err) {
        if (titleEl) titleEl.textContent = '오류';
        if (metaEl) metaEl.textContent = '';
        if (bodyEl) bodyEl.innerHTML = '<p class="notice-content">데이터를 불러오지 못했습니다. (' + escapeHtml(err.message) + ')</p>';
      });
  }

  function boot() {
    $all('[data-notice-app]').forEach(initNoticeIndex);
    $all('[data-notice-view]').forEach(initNoticeView);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
