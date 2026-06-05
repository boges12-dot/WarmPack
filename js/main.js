const toggle = document.querySelector('.menu-toggle');
if (toggle) {
  toggle.addEventListener('click', () => document.body.classList.toggle('menu-open'));
}
