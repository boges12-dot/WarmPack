/*
  config-links.js
  - Static site helper to bind buttons/links to URLs stored in JSON config files.
  - Designed for GitHub Pages / subpath hosting.

  Usage:
    bindConfigLinks({
      json: '../../data/downloads.json',
      bindings: [
        { selector: '#btnClient', keyPath: 'client.url' },
        { selector: '#btnPatch',  keyPath: 'patch.url'  }
      ],
      emptyMessage: '링크가 아직 준비되지 않았습니다.'
    });
*/

(function (global) {
  'use strict';

  function get(obj, path) {
    if (!obj || !path) return undefined;
    const parts = String(path).split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
      else return undefined;
    }
    return cur;
  }

  function isHttpUrl(u) {
    return typeof u === 'string' && /^https?:\/\//i.test(u.trim());
  }

  function isExternalLike(u, re) {
    if (typeof u !== 'string') return false;
    const s = u.trim();
    if (!s) return false;
    if (re instanceof RegExp) return re.test(s);
    return isHttpUrl(s);
  }

  function setAsLink(el, url, externalRe) {
    el.setAttribute('href', url);
    if (isExternalLike(url, externalRe)) {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
    el.classList.add('is-ready');
    el.setAttribute('aria-disabled', 'false');
  }

  function setAsPending(el, message) {
    el.setAttribute('href', '#');
    el.classList.remove('is-ready');
    el.setAttribute('aria-disabled', 'true');

    // prevent jump + show guidance
    el.addEventListener('click', function (e) {
      e.preventDefault();
      alert(message);
    });
  }

  async function bindConfigLinks(opts) {
    const json = (opts && opts.json) || '';
    const bindings = (opts && opts.bindings) || [];
    const externalRe = (opts && opts.externalRe) || null;
    const emptyMessage = (opts && opts.emptyMessage) ||
      '링크가 아직 준비되지 않았습니다.\n운영자가 설정 파일에 URL을 등록하면 바로 열립니다.';

    if (!json || !bindings.length) return;

    let data = null;
    try {
      const r = await fetch(json, { cache: 'no-store' });
      if (!r.ok) throw new Error('config not found');
      data = await r.json();
    } catch (_) {
      // If config file is missing, mark all as pending.
      bindings.forEach(b => {
        const el = document.querySelector(b.selector);
        if (el) setAsPending(el, emptyMessage);
      });
      return;
    }

    bindings.forEach(b => {
      const el = document.querySelector(b.selector);
      if (!el) return;
      const url = (get(data, b.keyPath) || '').trim();
      if (url) setAsLink(el, url, externalRe);
      else setAsPending(el, emptyMessage);
    });
  }

  // Bind links that declare a key in a data-attribute.
  // Example: <a data-community-link="kakao" href="#">...</a>
  async function bindAttrConfigLinks(opts) {
    const json = (opts && opts.json) || '';
    const attr = (opts && opts.attr) || '';
    const keyUrlSuffix = (opts && opts.keyUrlSuffix) || 'url';
    const externalRe = (opts && opts.externalRe) || null;
    const emptyMessage = (opts && opts.emptyMessage) ||
      '링크가 아직 준비되지 않았습니다.\n운영자가 설정 파일에 URL을 등록하면 바로 열립니다.';

    if (!json || !attr) return;
    const els = Array.from(document.querySelectorAll('[' + attr + ']'));
    if (!els.length) return;

    let data = null;
    try {
      const r = await fetch(json, { cache: 'no-store' });
      if (!r.ok) throw new Error('config not found');
      data = await r.json();
    } catch (_) {
      els.forEach(el => setAsPending(el, emptyMessage));
      return;
    }

    els.forEach(el => {
      const key = (el.getAttribute(attr) || '').trim();
      const url = key ? (get(data, key + '.' + keyUrlSuffix) || '').trim() : '';
      if (url) setAsLink(el, url, externalRe);
      else setAsPending(el, emptyMessage);
    });
  }

  global.bindConfigLinks = bindConfigLinks;
  global.bindAttrConfigLinks = bindAttrConfigLinks;
})(window);
