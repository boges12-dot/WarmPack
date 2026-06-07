const toggle = document.querySelector('.menu-toggle');
if (toggle) {
  toggle.addEventListener('click', () => document.body.classList.toggle('menu-open'));
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
