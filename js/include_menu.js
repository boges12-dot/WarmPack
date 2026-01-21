document.addEventListener("DOMContentLoaded", () => {
  const placeholders = document.querySelectorAll('[data-include="menu"]');
  if (!placeholders.length) return;

  fetch('includes/menu.html')
    .then(r => r.text())
    .then(html => {
      placeholders.forEach(p => p.outerHTML = html);
    })
    .catch(()=>{});
});
