(function () {
  const inPages = /\/pages\//.test(location.pathname.replace(/\\/g, '/'));
  const root = inPages ? '../' : '';
  const page = location.pathname.split('/').pop() || 'index.html';
  const href = (path) => `${root}${path}`;

  const groups = [
    ['about', '서버소개', 'pages/about.html', [
      ['서버 정보', 'pages/about-info.html'], ['홍보글', 'pages/promotion.html'],
      ['공지사항', 'pages/notice.html'], ['업데이트', 'pages/update.html'], ['이벤트', 'pages/event.html']]],
    ['guide', '가이드', 'pages/guide.html', [
      ['초보자 가이드', 'pages/guide-beginner.html'], ['레벨업 가이드', 'pages/guide-leveling.html'],
      ['인챈트 가이드', 'pages/guide-enchant.html']]],
    ['item', '아이템정보', 'pages/items.html', [
      ['무기', 'pages/item-weapon.html'], ['방어구', 'pages/item-armor.html'],
      ['액세서리', 'pages/item-accessory.html'], ['세트 아이템', 'pages/item-set.html'],
      ['마법인형', 'pages/item-doll.html'], ['스킬', 'pages/item-skill.html']]],
    ['hunting', '사냥터', 'pages/hunting.html', [
      ['초급 사냥터', 'pages/hunting-low.html'], ['중급 사냥터', 'pages/hunting-mid.html'],
      ['고급 사냥터', 'pages/hunting-high.html']]],
    ['boss', '보스정보', 'pages/boss.html', [
      ['필드보스', 'pages/boss-field.html'], ['던전보스', 'pages/boss-dungeon.html']]]
  ];

  const isActive = (key) => {
    if (key === 'about') return /^(about|promotion|notice|update|event)/.test(page);
    if (key === 'item') return /^(item|skill)/.test(page);
    return page.startsWith(key);
  };

  const navGroups = groups.map(([key, label, target, children]) => {
    const active = isActive(key);
    const links = children.map(([text, path]) => `<a href="${href(path)}">${text}</a>`).join('');
    return `<div class="nav-item has-dropdown${active ? ' active-group' : ''}">
      <div class="nav-parent">
        <a class="nav-link${active ? ' active' : ''}" href="${href(target)}"${active ? ' aria-current="page"' : ''}>${label}</a>
        <button class="submenu-toggle" type="button" aria-expanded="false" aria-label="${label} 하위 메뉴 열기"><span aria-hidden="true">⌄</span></button>
      </div>
      <div class="dropdown-menu">${links}</div>
    </div>`;
  }).join('');

  const header = document.querySelector('[data-site-header]');
  if (header) {
    header.outerHTML = `<header class="site-header">
      <a class="brand" href="${href('index.html')}" aria-label="광어 서버 홈">
        <span class="brand-title">광어 서버</span><span class="brand-sub">치열한 전투와 짜릿한 성장</span>
      </a>
      <button class="menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="primary-nav">☰</button>
      <nav class="nav" id="primary-nav" aria-label="주 메뉴">
        <a class="nav-link${page === 'index.html' ? ' active' : ''}" href="${href('index.html')}"${page === 'index.html' ? ' aria-current="page"' : ''}>HOME</a>
        ${navGroups}
        <a class="nav-link${page === 'community.html' ? ' active' : ''}" href="${href('pages/community.html')}"${page === 'community.html' ? ' aria-current="page"' : ''}>커뮤니티</a>
      </nav>
      <a class="download-btn" href="${href('pages/download.html')}">게임 다운로드</a>
    </header>`;
  }

  const footer = document.querySelector('[data-site-footer]');
  if (footer) {
    footer.outerHTML = `<footer class="footer"><div class="container footer-inner footer-simple">
      <span>Copyright © 2026 광어 서버</span>
      <a href="${href('pages/terms.html')}">이용약관</a>
      <a href="${href('pages/privacy.html')}">개인정보처리방침</a>
    </div></footer>`;
  }
})();
