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

  function getQueryParam(key) {
    try { return new URLSearchParams(location.search).get(key); }
    catch (e) { return null; }
  }

  function norm(s) { return String(s || '').toLowerCase().trim(); }

  function matchQuery(item, q) {
    if (!q) return true;
    var hay = norm(
      (item.title || '') + ' ' +
      (item.summary || '') + ' ' +
      (item.content || '') + ' ' +
      (item.category || '')
    );
    return hay.indexOf(q) !== -1;
  }

  function initNoticeIndex(app) {
    var jsonUrl = app.getAttribute('data-json') || '../../data/notices.json';
    var listEl = $('[data-notice-list]', app);
    var emptyEl = $('[data-notice-empty]', app);
    var selEl = $('[data-notice-filter]', app);

    // New controls (optional)
    var searchEl = $('[data-notice-search]', app);
    var sortEl = $('[data-notice-sort]', app);
    var moreBtn = $('[data-notice-more]', app);
    var countEl = $('[data-notice-count]', app);

    // Optional fixed category (category pages / section blocks)
    var fixedCategory = app.getAttribute('data-category') || '';

    // Optional: allow URL param override (?cat=업데이트)
    var urlCat = getQueryParam('cat');
    if (!fixedCategory && urlCat) fixedCategory = urlCat;

    // Optional: hide filter UI when category is fixed
    var hideFilter = app.hasAttribute('data-hide-filter');

    // Optional: limit number of items rendered (section blocks)
    var limitAttr = app.getAttribute('data-limit');
    var hardLimit = limitAttr ? parseInt(limitAttr, 10) : 0;
    if (isNaN(hardLimit) || hardLimit < 0) hardLimit = 0;

    // Page size for "더보기" (0 => no pagination)
    var pageSizeAttr = app.getAttribute('data-page-size');
    var pageSize = pageSizeAttr ? parseInt(pageSizeAttr, 10) : 20;
    if (isNaN(pageSize) || pageSize < 1) pageSize = 20;

    // If this is a hard-limited block, don't show extra controls
    if (hardLimit) {
      if (moreBtn) moreBtn.hidden = true;
      if (countEl) countEl.hidden = true;
      // Search/sort/filter UI might exist in shared markup; hide them here.
      var controls = $('.notice-controls', app);
      if (controls) controls.hidden = true;
    }

    var allItems = [];
    var shown = 0;

    function buildItemLi(it) {
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

      return li;
    }

    function sortItems(items, mode) {
      var out = items.slice();
      if (mode === 'old') {
        out.sort(function (a, b) { return String(a.date || '').localeCompare(String(b.date || '')); });
      } else if (mode === 'title') {
        out.sort(function (a, b) { return String(a.title || '').localeCompare(String(b.title || '')); });
      } else {
        // latest
        out.sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
      }
      return out;
    }

    function applyFilters() {
      var q = searchEl ? norm(searchEl.value) : '';
      var cat = fixedCategory || (selEl ? selEl.value : '');
      var mode = sortEl ? sortEl.value : 'latest';

      var filtered = allItems.filter(function (it) {
        if (cat && String(it.category || '') !== String(cat)) return false;
        return matchQuery(it, q);
      });

      filtered = sortItems(filtered, mode);
      return filtered;
    }

    function render(items) {
      listEl.innerHTML = '';

      if (!items || !items.length) {
        emptyEl.hidden = false;
        if (countEl) countEl.textContent = '0';
        if (moreBtn) moreBtn.hidden = true;
        return;
      }

      emptyEl.hidden = true;

      var out = items;

      if (hardLimit) {
        if (out.length > hardLimit) out = out.slice(0, hardLimit);
      } else {
        if (shown === 0) shown = pageSize;
        out = out.slice(0, shown);
      }

      out.forEach(function (it) { listEl.appendChild(buildItemLi(it)); });

      if (!hardLimit) {
        if (countEl) countEl.textContent = String(items.length);
        if (moreBtn) moreBtn.hidden = (shown >= items.length);
      }
    }

    function rerender(resetShown) {
      if (hardLimit) return; // hard-limited blocks don't support controls
      if (resetShown) shown = 0;
      var filtered = applyFilters();
      render(filtered);
    }

    fetchJson(jsonUrl)
      .then(function (data) {
        var items = Array.isArray(data) ? data.slice() : [];
        // Normalize missing fields
        items = items.filter(Boolean);

        // Build category filter options from all items
        var cats = {};
        items.forEach(function (it) { if (it && it.category) cats[it.category] = true; });
        var catList = Object.keys(cats).sort();

        if (selEl) {
          selEl.innerHTML = '<option value="">전체</option>' +
            catList.map(function (c) {
              return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
            }).join('');
        }

        allItems = items;

        // If fixed category is set, lock UI
        if (fixedCategory && selEl) {
          selEl.value = fixedCategory;
          if (hideFilter) {
            var controls = $('.notice-controls', app);
            if (controls) controls.hidden = true;
          }
        }

        // Bind controls (only if not hardLimit)
        if (!hardLimit) {
          if (selEl && !fixedCategory) {
            selEl.addEventListener('change', function () { rerender(true); });
          }
          if (searchEl) {
            var t = null;
            searchEl.addEventListener('input', function () {
              if (t) clearTimeout(t);
              t = setTimeout(function () { rerender(true); }, 120);
            });
          }
          if (sortEl) {
            sortEl.addEventListener('change', function () { rerender(true); });
          }
          if (moreBtn) {
            moreBtn.addEventListener('click', function (e) {
              e.preventDefault();
              shown += pageSize;
              render(applyFilters());
            });
          }
        }

        // Initial render
        if (fixedCategory && selEl) {
          selEl.value = fixedCategory;
        }
        render(applyFilters());
      })
      .catch(function (err) {
        if (emptyEl) {
          emptyEl.hidden = false;
          emptyEl.textContent = '공지 데이터를 불러오지 못했습니다. (' + err.message + ')';
        }
        if (moreBtn) moreBtn.hidden = true;
      });
  }

  function initNoticeView(root) {
    var jsonUrl = root.getAttribute('data-json') || '../../data/notices.json';
    var id = getQueryParam('id');

    var titleEl = $('[data-notice-title]', root);
    var metaEl = $('[data-notice-meta]', root);
    var bodyEl = $('[data-notice-body]', root);
    var backEl = $('[data-notice-back]', root);

    var relatedWrap = $('[data-notice-related]', root);
    var relatedList = $('[data-notice-related-list]', root);

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
          if (relatedWrap) relatedWrap.hidden = true;
          return;
        }

        if (titleEl) titleEl.textContent = item.title || '공지';
        if (metaEl) metaEl.textContent = (item.category || '공지') + ' · ' + formatDate(item.date);
        if (bodyEl) bodyEl.innerHTML = toParagraphs(item.content || item.summary || '');

        // Related: same category, newest 3 (excluding current)
        if (relatedWrap && relatedList) {
          var sameCat = String(item.category || '공지');
          var related = items
            .filter(function (x) { return x && String(x.id) !== String(item.id) && String(x.category || '공지') === sameCat; })
            .sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); })
            .slice(0, 3);

          if (related.length) {
            relatedWrap.hidden = false;
            relatedList.innerHTML = related.map(function (x) {
              var href = 'notice_view.html?id=' + encodeURIComponent(x.id);
              var title = escapeHtml(x.title || '');
              var date = escapeHtml(formatDate(x.date));
              return '<li class="notice-related-item">' +
                '<a class="notice-related-link" href="' + href + '">' +
                '<span class="notice-related-title-text">' + title + '</span>' +
                '<span class="notice-related-date">' + date + '</span>' +
                '</a>' +
                '</li>';
            }).join('');
          } else {
            relatedWrap.hidden = true;
          }
        }
      })
      .catch(function (err) {
        if (titleEl) titleEl.textContent = '오류';
        if (metaEl) metaEl.textContent = '';
        if (bodyEl) bodyEl.innerHTML = '<p class="notice-content">데이터를 불러오지 못했습니다. (' + escapeHtml(err.message) + ')</p>';
        if (relatedWrap) relatedWrap.hidden = true;
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


// 자동 가나다 정렬 적용

function sortByKoreanName(arr){
  return arr.sort((a,b)=>a.name.trim().localeCompare(b.name.trim(),'ko'));
}

if(typeof tier1Items!=='undefined') sortByKoreanName(tier1Items);
if(typeof tier2Items!=='undefined') sortByKoreanName(tier2Items);
if(typeof tier3Items!=='undefined') sortByKoreanName(tier3Items);
