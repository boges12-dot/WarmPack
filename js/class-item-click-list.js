(function(){
  function init(){
    document.querySelectorAll('.class-items-page .class-item-grid').forEach(function(grid){
      var cards=Array.from(grid.querySelectorAll(':scope > details.class-item-card'));
      if(!cards.length || grid.closest('.class-item-category-layout'))return;
      var layout=document.createElement('div');layout.className='class-item-category-layout';
      grid.parentNode.insertBefore(layout,grid);layout.appendChild(grid);
      var panel=document.createElement('section');panel.className='class-item-selection-detail';panel.setAttribute('aria-live','polite');layout.appendChild(panel);
      function select(card){
        cards.forEach(function(c){c.open=(c===card);});
        var name=card.querySelector('.class-item-name');
        var detail=card.querySelector('.class-item-detail');
        panel.replaceChildren();
        var title=document.createElement('h4');title.textContent=name?name.textContent.trim():'아이템 상세 정보';panel.appendChild(title);
        if(detail)panel.appendChild(detail.cloneNode(true));
      }
      cards.forEach(function(card){
        var summary=card.querySelector('summary');
        summary.addEventListener('click',function(ev){ev.preventDefault();select(card);});
      });
      select(cards[0]);
    });
    var intro=document.querySelector('.class-items-page .class-intro');
    if(intro)intro.textContent='1차·2차·3차 장비를 확인하세요. 왼쪽 목록에서 아이템을 클릭하면 상세 이미지와 옵션이 표시됩니다.';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();