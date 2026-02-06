/* item_tile_toggle.js
   목표
   - 카드 상시 영역: 아이템 이미지 + 아이템명(+ 버튼)만 표시
   - 펼쳤을 때(상세): 하단에 따로 있던 "옵션"/"획득"(kv 블록)을
     가운데 상세 박스(.item-detail) 안의 표(ul.item-spec)로 이동
   - 기존 요약/중복 표시는 제거
   - 각 카드 상세 토글은 개별 동작 (기존 구조 유지)
*/

(function () {
  function toText(v) {
    return (v ?? '').toString().trim();
  }

  function ensureItemDetailBox(detailEl) {
    let box = detailEl.querySelector('.item-detail');
    if (box) return box;

    box = document.createElement('div');
    box.className = 'item-detail';

    const title = document.createElement('div');
    title.className = 'item-detail-title';
    title.textContent = '상세 정보';

    const spec = document.createElement('ul');
    spec.className = 'item-spec';

    box.appendChild(title);
    box.appendChild(spec);

    const divider = detailEl.querySelector('.tile-divider');
    if (divider) {
      divider.insertAdjacentElement('afterend', box);
    } else {
      detailEl.prepend(box);
    }

    return box;
  }

  function findOrCreateSpecRow(specEl, keyText) {
    const key = toText(keyText);
    if (!key) return null;

    const existing = Array.from(specEl.querySelectorAll('li')).find((li) => {
      const dt = li.querySelector('dt');
      return dt && toText(dt.textContent) === key;
    });
    if (existing) return existing;

    const li = document.createElement('li');
    const dt = document.createElement('dt');
    dt.textContent = key;
    const dd = document.createElement('dd');
    dd.textContent = '-';
    li.appendChild(dt);
    li.appendChild(dd);
    specEl.appendChild(li);
    return li;
  }

  function moveKvBlocksIntoDetail(tile) {
    const detail = tile.querySelector('.tile-detail');
    if (!detail) return;

    // kv 블록은 detail의 직계 자식으로 들어가는 구조(옵션/획득 등)
    const kvChildren = Array.from(detail.children).filter((ch) => ch.classList && ch.classList.contains('kv'));
    if (kvChildren.length === 0) {
      // 구버전 흔적 제거
      detail.querySelectorAll('.tile-extra').forEach((el) => el.remove());
      return;
    }

    const box = ensureItemDetailBox(detail);
    const spec = box.querySelector('.item-spec');
    if (!spec) return;

    kvChildren.forEach((kv) => {
      const k = kv.querySelector('.kv-key');
      const v = kv.querySelector('.kv-val');
      const key = toText(k ? k.textContent : '');
      if (!key) {
        kv.remove();
        return;
      }

      const li = findOrCreateSpecRow(spec, key);
      if (!li) {
        kv.remove();
        return;
      }

      const dd = li.querySelector('dd');
      if (!dd) {
        kv.remove();
        return;
      }

      // 기존 값이 '-' 또는 비어있으면 교체, 아니면 줄바꿈으로 추가
      const incomingHtml = v ? v.innerHTML : '';
      const currentText = toText(dd.textContent);
      if (currentText === '' || currentText === '-') {
        dd.innerHTML = incomingHtml || '-';
      } else if (incomingHtml) {
        // 중복 방지
        const incomingText = toText(v ? v.textContent : '');
        if (incomingText && !toText(dd.textContent).includes(incomingText)) {
          dd.innerHTML = dd.innerHTML + '<br>' + incomingHtml;
        }
      }

      kv.remove();
    });

    // 구버전 요약/추가블록 제거
    tile.querySelectorAll('.tile-summary, .tile-extra').forEach((el) => el.remove());
  }

  function simplifyAlwaysVisibleArea(tile) {
    const text = tile.querySelector('.tile-text');
    if (!text) return;

    // 아이템명 외 텍스트(부위/옵션/획득 등) 제거
    text.querySelectorAll('.tile-sub, .tile-sub2, .tile-summary').forEach((el) => el.remove());

    // 혹시 다른 줄 요소가 섞여있다면 title 외는 제거(버튼 영역은 별도 .tile-btn이므로 안전)
    // 혹시 title 외의 텍스트가 직계로 남아있으면 정리
    const title = text.querySelector('.tile-title');
    Array.from(text.children).forEach((ch) => {
      if (!title) return;
      if (ch === title) return;
      // title이 wrapper 안에 들어간 구조면 wrapper는 남김
      if (ch.querySelector && ch.querySelector('.tile-title')) return;
      if (ch.classList && (ch.classList.contains('tile-title') || ch.classList.contains('tile-title-wrap'))) return;
      // 나머지는 제거
      ch.remove();
    });
  }

  function runOnce() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile) => {
      simplifyAlwaysVisibleArea(tile);
      moveKvBlocksIntoDetail(tile);
    });
  }

  // 초기 1회 + (필터/탭 전환 등으로 DOM이 재렌더될 수 있어) 짧게 재시도
  function boot() {
    runOnce();

    let tries = 0;
    const maxTries = 10;
    const iv = setInterval(() => {
      tries += 1;
      runOnce();
      if (tries >= maxTries) clearInterval(iv);
    }, 300);

    // 동적으로 내용이 추가될 경우 대응
    const mo = new MutationObserver(() => runOnce());
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
