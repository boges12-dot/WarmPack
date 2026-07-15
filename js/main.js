const toggle = document.querySelector('.menu-toggle');
if (toggle) {
  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '메뉴 열기');
    toggle.textContent = '☰';
  };

  toggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    toggle.textContent = isOpen ? '✕' : '☰';
  });

  document.querySelectorAll('.submenu-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.nav-item');
      const isOpen = !item.classList.contains('submenu-open');
      document.querySelectorAll('.nav-item.submenu-open').forEach((openItem) => {
        openItem.classList.remove('submenu-open');
        openItem.querySelector('.submenu-toggle')?.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('submenu-open', isOpen);
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

// 아이템/세트 카드 클릭 시 상세 옵션 펼침
function setupClickableCards() {
  const cards = document.querySelectorAll('.item-info-card, .set-item-card');
  cards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-expanded', 'false');

    const toggleCard = () => {
      const isOpen = card.classList.toggle('is-open');
      card.setAttribute('aria-expanded', String(isOpen));
    };

    card.addEventListener('click', toggleCard);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCard();
      }
    });
  });
}

setupClickableCards();

// 자료가 많은 목록 페이지에 이름 검색을 자동으로 제공합니다.
function setupCardSearch() {
  const grid = document.querySelector('.item-info-grid, .set-item-grid, .skill-grid');
  if (!grid) return;

  const cards = [...grid.querySelectorAll('.item-info-card, .set-item-card, .skill-card')];
  if (cards.length < 8) return;

  const search = document.createElement('div');
  search.className = 'content-search';
  search.innerHTML = `<label for="content-search-input">목록 검색</label>
    <input id="content-search-input" type="search" placeholder="이름이나 옵션을 입력하세요" autocomplete="off">
    <span class="search-result" aria-live="polite"></span>`;
  grid.before(search);

  const input = search.querySelector('input');
  const result = search.querySelector('.search-result');
  const update = () => {
    const query = input.value.trim().toLocaleLowerCase('ko');
    let visible = 0;
    cards.forEach((card) => {
      const matches = !query || card.textContent.toLocaleLowerCase('ko').includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    result.textContent = query ? `${visible}개 결과` : `전체 ${cards.length}개`;
  };
  input.addEventListener('input', update);
  update();
}

setupCardSearch();
