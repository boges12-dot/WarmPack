(function () {
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  if (!menuToggle || !siteNav) return;

  const isMobile = () => window.matchMedia("(max-width: 980px)").matches;

  // 모바일 전체 메뉴 열기/닫기
  menuToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    if (!open) closeAllSubs();
  });

  // 2단 메뉴 버튼 클릭(모바일에서만 토글)
  siteNav.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-item.has-sub > .nav-btn");
    if (!btn) return;

    if (!isMobile()) return; // 데스크탑은 hover로
    e.preventDefault();

    const item = btn.closest(".nav-item");
    const expanded = btn.getAttribute("aria-expanded") === "true";

    // 다른 서브메뉴 닫기
    [...siteNav.querySelectorAll(".nav-item.has-sub")].forEach(li => {
      if (li !== item) {
        li.classList.remove("open");
        const b = li.querySelector(".nav-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });

    item.classList.toggle("open", !expanded);
    btn.setAttribute("aria-expanded", String(!expanded));
  });

  // 바깥 클릭하면 닫기(모바일)
  document.addEventListener("click", (e) => {
    if (!isMobile()) return;
    if (siteNav.contains(e.target) || menuToggle.contains(e.target)) return;
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    closeAllSubs();
  });

  // 리사이즈 시 상태 정리
  window.addEventListener("resize", () => {
    if (!isMobile()) {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      closeAllSubs();
    }
  });

  function closeAllSubs() {
    siteNav.querySelectorAll(".nav-item.has-sub").forEach(li => {
      li.classList.remove("open");
      const b = li.querySelector(".nav-btn");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }
})();
