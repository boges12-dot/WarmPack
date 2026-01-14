/*<![CDATA[*/
(function () {


  // ===== Helpers (GitHub Pages safe) =====
  function fmt(iso){
    try{
      if(!iso) return '';
      var d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      var y = d.getFullYear();
      var m = String(d.getMonth()+1).padStart(2,'0');
      var day = String(d.getDate()).padStart(2,'0');
      return y + '-' + m + '-' + day;
    }catch(e){ return ''; }
  }

  // ===== (v45) Layout에서 수정한 '상단 메뉴'를 실제 메뉴로 반영 =====
  // 레이아웃 > '상단 메뉴(레이아웃에서 수정)' 링크 목록에서
  //  - 상위: "서버 가이드"
  //  - 하위: "서버 가이드 > 가이드 영상"  또는  "서버 가이드 :: 가이드 영상"
  (function(){
    try{
      var sec = document.getElementById('TopMenu');
      var nav = document.getElementById('main-nav');
      if (!sec || !nav) return;

      var list = sec.querySelector('.LinkList ul');
      if (!list) return;

      var links = list.querySelectorAll('li a');
      if (!links || !links.length) return; // 비어있으면 기존(코드) 메뉴 유지

      // 메뉴 초기화 후 재구성
      nav.innerHTML = '';

      var parents = {}; // name -> {li,a,sub}
      var topItems = [];

      for (var i=0;i<links.length;i++){
        var a0 = links[i];
        var text = (a0.textContent || '').trim();
        var href = a0.getAttribute('href') || '#';
        var m = text.match(/^(.+?)\s*(?:>|::)\s*(.+)$/);
        if (!m){
          topItems.push({type:'top', t:text, h:href});
        }else{
          topItems.push({type:'sub', p:m[1].trim(), c:m[2].trim(), h:href});
        }
      }

      var makeTop = function(name, href){
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.textContent = name;
        a.setAttribute('href', href || '#');
        li.appendChild(a);
        nav.appendChild(li);
      };

      var ensureParent = function(name){
        if (parents[name]) return parents[name];
        var li = document.createElement('li');
        li.className = 'has-sub';
        var a = document.createElement('a');
        a.textContent = name;
        a.setAttribute('href', '#');
        li.appendChild(a);
        var sub = document.createElement('ul');
        sub.className = 'submenu';
        li.appendChild(sub);
        nav.appendChild(li);
        parents[name] = {li:li, a:a, sub:sub};
        return parents[name];
      };

      // 1) 빌드
      for (var j=0;j<topItems.length;j++){
        var it = topItems[j];
        if (it.type === 'top'){
          makeTop(it.t, it.h);
        }else{
          var pobj = ensureParent(it.p);
          var cli = document.createElement('li');
          var ca = document.createElement('a');
          ca.textContent = it.c;
          ca.setAttribute('href', it.h);
          cli.appendChild(ca);
          pobj.sub.appendChild(cli);
        }
      }

      // 2) 부모 항목(상위) 단독 링크가 있으면 href 승격 + 중복 제거
      var topLinks = nav.querySelectorAll(':scope > li > a');
      for (var k=0;k<topLinks.length;k++){
        var a1 = topLinks[k];
        var t1 = (a1.textContent || '').trim();
        if (parents[t1]){
          parents[t1].a.setAttribute('href', a1.getAttribute('href') || '#');
          // remove standalone duplicate li
          a1.parentNode.parentNode.removeChild(a1.parentNode);
        }
      }

      // 3) 드롭다운 표시용 caret(PC)
      var ps = nav.querySelectorAll('li.has-sub > a');
      for (var x=0;x<ps.length;x++){
        if (ps[x].textContent.indexOf('▾') === -1){
          ps[x].insertAdjacentText('beforeend', ' ▾');
        }
      }

      // 4) 모바일용 서브메뉴 토글 버튼 재생성(중복 방지)
      // 기존 토글 제거
      var oldToggles = nav.querySelectorAll('.submenu-toggle');
      for (var y=0;y<oldToggles.length;y++) oldToggles[y].remove();

      var items = nav.querySelectorAll('li');
      for (var z=0;z<items.length;z++){
        var li0 = items[z];
        var submenu = li0.querySelector(':scope > ul.submenu');
        var link = li0.querySelector(':scope > a');
        if (!submenu || !link) continue;

        var t = document.createElement('button');
        t.type = 'button';
        t.className = 'submenu-toggle';
        t.setAttribute('aria-label', '하위 메뉴 열기/닫기');
        t.innerHTML = '<span aria-hidden="true">▾</span>';
        link.insertAdjacentElement('afterend', t);

        t.addEventListener('click', (function(liRef){
          return function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            liRef.classList.toggle('submenu-open');
          };
        })(li0));
      }
    }catch(e){}
  })();


  // 1) 메뉴 활성 표시
  var path = location.pathname;
  var links = document.querySelectorAll('#main-nav a[href]');
  for (var i = 0; i < links.length; i++) {
    var a = links[i];
    var href = a.getAttribute('href');
    if (!href || href === '#' || href.indexOf('javascript:') === 0) continue;
    var linkPath = (new URL(a.href, location.origin)).pathname;
    if (linkPath === '/' && path === '/') a.classList.add('active');
    if (linkPath !== '/' && (path === linkPath || path.indexOf(linkPath) === 0)) a.classList.add('active');
  }

  // 2) 모바일 메뉴 토글 + 서브메뉴 토글
  var toggleBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('main-nav');
  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    var subLinks = nav.querySelectorAll('li.has-sub > a');
    
    // 접근성: 드롭다운 부모 ARIA
    for (var s = 0; s < subLinks.length; s++) {
      subLinks[s].setAttribute('aria-haspopup', 'true');
      subLinks[s].setAttribute('aria-expanded', 'false');
    }
for (var j = 0; j < subLinks.length; j++) {
      subLinks[j].addEventListener('click', function (e) {
        if (window.matchMedia('(max-width: 768px)').matches) {
          e.preventDefault();
          this.parentElement.classList.toggle('open');
          this.setAttribute('aria-expanded', this.parentElement.classList.contains('open') ? 'true' : 'false');
        }
      });
    }
  }

  // 3) 홈 전용 레이아웃 + 4) 공지 자동 출력
  var isHome = (path === '/' || path === '/index.html');
  if (isHome) {
    document.body.classList.add('is-home');
    var homeTop = document.getElementById('home-top');
    if (homeTop) homeTop.style.display = 'none';

    var postsWrap = document.getElementById('posts-wrap');
    if (postsWrap) postsWrap.classList.add('home-grid');

    

    // 홈 카드 강화: 첫 이미지 썸네일 + 본문 요약
    (function enhanceHomeCards(){
      var container = document.getElementById('posts-wrap');
      if (!container) return;

      var postOuters = container.querySelectorAll('.post-outer');
      for (var i = 0; i < postOuters.length; i++) {
        var po = postOuters[i];
        if (po.getAttribute('data-cardified') === '1') continue;

        var titleEl = po.querySelector('.post-title');
        var bodyEl = po.querySelector('.post-body');
        if (!titleEl || !bodyEl) continue;

        // 썸네일: 본문 첫 img
        var img = bodyEl.querySelector('img');
        var thumbUrl = img ? (img.getAttribute('src') || img.src) : '';

        // 텍스트 요약: 본문 텍스트만 추출
        var text = (bodyEl.textContent || '').replace(/\s+/g, ' ').trim();
        if (text.length > 140) text = text.slice(0, 140) + '…';

        // wrapper 구성
        var card = document.createElement('div');
        card.className = 'post-card';

        if (thumbUrl) {
          var thumb = document.createElement('div');
          thumb.className = 'post-card-thumb';
          // 따옴표 문제 회피
          thumb.style.backgroundImage = 'url(' + thumbUrl.replace(/["\']/g,'') + ')';
          card.appendChild(thumb);
        }

        var inner = document.createElement('div');
        inner.className = 'post-card-inner';

        // meta (작성자/시간이 있으면 표시)
        var meta = document.createElement('div');
        meta.className = 'post-card-meta';
        var author = po.querySelector('.post-author');
        var time = po.querySelector('.post-timestamp');
        meta.innerHTML = '<span>' + (author ? author.textContent.trim() : '') + '</span>'
                       + '<span>' + (time ? time.textContent.trim() : '') + '</span>';
        inner.appendChild(meta);

        // 제목(원본 제목 노드 이동)
        inner.appendChild(titleEl);

        // 요약
        var snip = document.createElement('div');
        snip.className = 'post-snippet';
        snip.textContent = text;
        inner.appendChild(snip);

        // 더보기 버튼
        var link = po.querySelector('.post-title a');
        var href = link ? link.getAttribute('href') : '';
        if (href) {
          var actions = document.createElement('div');
          actions.className = 'post-card-actions';
          actions.innerHTML = '<a class="post-readmore" href="' + href + '">자세히 보기 →</a>';
          inner.appendChild(actions);
        }

        card.appendChild(inner);

        // 기존 본문은 홈에서는 숨김(카드 형태만 노출)
        bodyEl.style.display = 'none';

        // 카드 삽입
        po.insertBefore(card, po.firstChild);
        po.setAttribute('data-cardified', '1');
      }
    })();
// XML 템플릿이라 & 는 반드시 &amp;
    var noticeFeedUrl = '/feeds/posts/default/-/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD?alt=json&max-results=5';

    (function(){
    var list = document.getElementById('notice-list');
    if (!list) return;

    var CACHE_KEY = 'notice_cache_v1';
    var TTL_MS = 10 * 60 * 1000; // 10분

    var render = function (data) {
      // 로딩 표시 해제
      list.classList.remove('is-loading');

      var entries = (data && data.feed && data.feed.entry) ? data.feed.entry : [];
      
      // 공지 고정 규칙:
      //  - 라벨에 '고정' 포함(예: '공지고정', '고정') 또는
      //  - 제목에 '[필독]' 또는 '필독' 포함
      var isPinned = function(entry){
        try{
          var t = (entry.title && entry.title.$t) ? entry.title.$t : '';
          if (t.indexOf('[필독]') !== -1 || t.indexOf('필독') !== -1) return true;
          var cats = entry.category || [];
          for (var i=0;i<cats.length;i++){
            var term = cats[i].term || '';
            if (term.indexOf('고정') !== -1) return true;
          }
        }catch(e){}
        return false;
      };
      // 고정 먼저, 그 다음 원래 순서 유지(안정적 정렬)
      entries = entries.map(function(e, idx){ return {e:e, idx:idx, p:isPinned(e)}; })
                     .sort(function(a,b){
                       if (a.p === b.p) return a.idx - b.idx;
                       return a.p ? -1 : 1;
                     })
                     .map(function(o){ return o.e; });

      var html = '';
      for (var k = 0; k < entries.length; k++) {
        var entry = entries[k];
        var title = (entry.title && entry.title.$t) ? entry.title.$t : '공지';

        var url = '#';
        if (entry.link && entry.link.length) {
          for (var m = 0; m < entry.link.length; m++) {
            if (entry.link[m].rel === 'alternate') { url = entry.link[m].href; break; }
          }
        }

        var dateText = fmt(entry.published && entry.published.$t ? entry.published.$t : '');

        var isNew = false;
        try {
          var now = Date.now();
          var pub = (entry.published && entry.published.$t) ? Date.parse(entry.published.$t) : 0;
          if (pub && (now - pub) <= (3 * 24 * 60 * 60 * 1000)) isNew = true;
        } catch (e) {}

        html += ''
          + '<li>'
          +   '<a href=\"' + url + '\">'
          +     '<div class=\"notice-item\">'
          +       '<span style=\"font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;\">' + title + '</span>'
          +       '<span style=\"display:flex; gap:8px; align-items:center; flex-shrink:0;\">'
          +         (isPinned(entry) ? '<span class=\"notice-pin\">PIN</span>' : '') + (isNew ? '<span class=\"notice-badge\">NEW</span>' : '')
          +         '<span style=\"font-size:12px; color:#9ca3af;\">' + dateText + '</span>'
          +       '</span>'
          +     '</div>'
          +   '</a>'
          + '</li>';
      }
      list.innerHTML = html;
    };

    // 캐시 먼저 시도
    try {
      var cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        var obj = JSON.parse(cached);
        if (obj && obj.t && (Date.now() - obj.t) < TTL_MS && obj.data) {
          render(obj.data);
          return;
        }
      }
    } catch (e) {}

    // 캐시 없으면 네트워크
    fetch(noticeFeedUrl)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({t: Date.now(), data: data}));
        } catch (e) {}
        render(data);
      })
      .catch(function () {
        list.classList.remove('is-loading');
        list.innerHTML = '<li>공지 로딩 실패</li>';
      });
  })();
  }

  // ===== 5) 스크롤 UI (헤더 그림자 + 맨 위로) =====
  var header = document.querySelector('header.header');
  var topBtn = document.getElementById('back-to-top');

  var ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      if (header) {
        if (y > 10) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }
      if (topBtn) {
        if (y > 500) topBtn.classList.add('show');
        else topBtn.classList.remove('show');
      }
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  if (topBtn) {
    topBtn.addEventListener('click', function () {
      try {
        window.scrollTo({top:0, behavior:'smooth'});
      } catch (e) {
        window.scrollTo(0,0);
      }
    });
  }


  

  // ===== Admin detect (로그인 관리자에게만 메뉴 노출) =====
  (function(){
    try{
      // Blogger는 관리자 로그인 시 'item-control' (빠른편집/삭제 등) 요소가 렌더링됨
      var adminEl = document.querySelector('.item-control, .quickedit, a.g-profile[href*="drafts"], a[href*="blogger.com/blog/post"]');
      if (adminEl) document.body.classList.add('is-admin');
    }catch(e){}
  })();


  // ===== Theme image config =====
  // 여기 URL/값만 바꾸면 바로 적용됨
  // 기본값(매칭 없을 때)
  var THEME_BG_IMAGE = '';        // 전체 배경 이미지 URL
  var HEADER_BG_IMAGE = '';       // 헤더 배경 이미지 URL
  var THEME_BG_OPACITY = 0.18;    // 배경 진하기(0.00 ~ 0.40 추천)
  var THEME_BG_BLUR_PX = 0;       // 배경 블러(px) 0~10 추천
  var HEADER_OVERLAY_OPACITY = 0.35; // 헤더 오버레이(0.0~0.7)

  // 옵션: 모바일에서는 배경 이미지 자동 OFF (true 추천)
  var THEME_BG_MOBILE_OFF = true;

  // ===== 페이지별 분기 규칙 =====
  // 위에서부터 먼저 매칭되는 규칙이 적용됨.
  // match:
  //   - 'home' : 홈(/ 또는 /index.html)
  //   - 'pathPrefix' : pathname이 prefix로 시작하면 매칭
  //   - 'pathRegex' : pathname 정규식 매칭 (문자열로 작성)
  //   - 'fullRegex' : (pathname+search) 정규식 매칭 (문자열로 작성)
  //
  // 예시 URL 넣는 곳:
  //  bg / header : ''(미사용) 또는 'https://.../image.jpg'
  var PAGE_BACKGROUNDS = [
    // 홈 전용 배경 예시
    { match:'home', bg:'', header:'', opacity:0.18, blur:0, overlay:0.35 },

    // 공지/라벨 페이지 (/search/label/...) 전용 배경 예시
    { match:'pathPrefix', value:'/search/label/', bg:'', header:'', opacity:0.16, blur:0, overlay:0.35 },

    // 정적 페이지(/p/...) 전용 배경 예시
    { match:'pathPrefix', value:'/p/', bg:'', header:'', opacity:0.14, blur:0, overlay:0.35 },

    // 개별 글(/YYYY/MM/...html) 전용 배경 예시
    { match:'pathRegex', value:'^/\\d{4}/\\d{2}/', bg:'', header:'', opacity:0.12, blur:0, overlay:0.35 }
  ];

  (function(){
    try{
      var path = location.pathname || '/';
      var full = path + (location.search || '');
      var isHome = (path === '/' || path === '/index.html');

      var isMobile = false;
      try { isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches; } catch(e) {}

      var pickRule = function(){
        for (var i=0;i<PAGE_BACKGROUNDS.length;i++){
          var r = PAGE_BACKGROUNDS[i];
          if (!r || !r.match) continue;
          if (r.match === 'home' && isHome) return r;
          if (r.match === 'pathPrefix' && r.value && path.indexOf(r.value) === 0) return r;
          if (r.match === 'pathRegex' && r.value) {
            try { if (new RegExp(r.value).test(path)) return r; } catch(e) {}
          }
          if (r.match === 'fullRegex' && r.value) {
            try { if (new RegExp(r.value).test(full)) return r; } catch(e) {}
          }
        }
        return null;
      };

      var rule = pickRule();

      // 최종 값(규칙이 있으면 규칙 우선, 없으면 기본값)
      var bg = rule && typeof rule.bg === 'string' ? rule.bg : THEME_BG_IMAGE;
      var header = rule && typeof rule.header === 'string' ? rule.header : HEADER_BG_IMAGE;
      var opacity = rule && typeof rule.opacity === 'number' ? rule.opacity : THEME_BG_OPACITY;
      var blur = rule && typeof rule.blur === 'number' ? rule.blur : THEME_BG_BLUR_PX;
      var overlay = rule && typeof rule.overlay === 'number' ? rule.overlay : HEADER_OVERLAY_OPACITY;

      // 모바일 OFF
      if (THEME_BG_MOBILE_OFF && isMobile) bg = '';

      // 적용
      if (bg) document.documentElement.style.setProperty('--theme-bg-image', 'url(' + bg + ')');
      else document.documentElement.style.setProperty('--theme-bg-image', 'none');

      if (header) document.documentElement.style.setProperty('--header-bg-image', 'url(' + header + ')');
      else document.documentElement.style.setProperty('--header-bg-image', 'none');

      document.documentElement.style.setProperty('--theme-bg-opacity', String(opacity));
      document.documentElement.style.setProperty('--theme-bg-blur', blur + 'px');
      document.documentElement.style.setProperty('--header-overlay-opacity', String(overlay));
    }catch(e){}
  })();
(function(){
    try{
      if (THEME_BG_IMAGE) document.documentElement.style.setProperty('--theme-bg-image', 'url(' + THEME_BG_IMAGE + ')');
      if (HEADER_BG_IMAGE) document.documentElement.style.setProperty('--header-bg-image', 'url(' + HEADER_BG_IMAGE + ')');
    }catch(e){}
  })();



  // ===== Home quick sticky top sync =====
  (function(){
    try{
      var header = document.querySelector('header.header');
      if (!header) return;

      var raf = 0;
      var update = function(){
        try{
          // 헤더가 slim/scrolled 상태든 항상 현재 높이 기준으로 계산
          var h = header.getBoundingClientRect().height || header.offsetHeight || 0;
          var top = Math.max(12, Math.round(h + 12));
          document.documentElement.style.setProperty('--home-quick-sticky-top', top + 'px');
        }catch(e){}
      };

      var onScroll = function(){
        if (raf) return;
        raf = window.requestAnimationFrame(function(){
          raf = 0;
          update();
        });
      };

      update();
      window.addEventListener('resize', update, {passive:true});
      window.addEventListener('scroll', onScroll, {passive:true});
      // 모바일/PC 전환 시 한 번 더
      window.addEventListener('orientationchange', update, {passive:true});
    }catch(e){}
  })();

})();
/*]]>*/
