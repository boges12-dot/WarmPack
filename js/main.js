const btn = document.querySelector('.mobile-btn');
const menu = document.querySelector('.menu');
btn?.addEventListener('click', () => {
  menu?.classList.toggle('open');
  btn.classList.toggle('open');
});
