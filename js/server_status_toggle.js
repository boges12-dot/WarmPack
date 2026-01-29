(function () {
  const toggle = document.getElementById('serverToggle');
  const openDate = document.getElementById('openDateText');
  if (!toggle || !openDate) return;

  // ---- Admin gate (static site friendly) ----
  // 관리자 모드: URL에 ?admin=1 또는 localStorage에 adminMode=1 이면 활성화
  const params = new URLSearchParams(location.search);
  const isAdmin = params.get('admin') === '1' || localStorage.getItem('adminMode') === '1';

  // Original open text (for restoring when ON)
  const originalOpen = openDate.getAttribute('data-original') || openDate.textContent.trim();
  openDate.setAttribute('data-original', originalOpen);

  // Persisted status (ON/OFF)
  const saved = (localStorage.getItem('serverStatus') || 'ON').toUpperCase();
  let state = (saved === 'OFF') ? 'OFF' : 'ON';

  function applyState(next) {
    state = next;
    const isOn = state === 'ON';

    // Header badge
    toggle.classList.toggle('on', isOn);
    toggle.classList.toggle('off', !isOn);
    const label = toggle.querySelector('.label') || toggle.querySelector('span');
    if (label) label.textContent = state;

    // Body open text
    if (isOn) {
      openDate.textContent = originalOpen;
      openDate.classList.remove('waiting');
    } else {
      openDate.textContent = '오픈 대기중';
      openDate.classList.add('waiting');
    }

    // Save
    localStorage.setItem('serverStatus', state);
  }

  applyState(state);

  if (isAdmin) {
    toggle.classList.add('admin');
    toggle.addEventListener('click', function () {
      applyState(state === 'ON' ? 'OFF' : 'ON');
    });
  }
})();