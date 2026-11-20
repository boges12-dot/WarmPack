(function(){
  function init(){
    document.querySelectorAll('.class-items-page .class-item-grid').forEach(function(grid){
      var cards=Array.from(grid.querySelectorAll(':scope > details.class-item-card'));
      if(!cards.length || grid.closest('.class-item-category-layout'))return;
      var layout=document.createElement('div');layout.className='class-item-category-layout';
      grid.parentNode.insertBefore(layout,grid);layout.appendChild(grid);
      var panel=document.createElement('section');panel.className='class-item-selection-detail';
      panel.setAttribute('aria-live','polite');panel.hidden=true;layout.appendChild(panel);
      var selected=null;
      function select(card){
        selected=(selected===card)?null:card;
        cards.forEach(function(c){
          c.open=false;
          var s=c.querySelector('summary');
          if(s)s.setAttribute('aria-expanded',String(c===selected));
          c.classList.toggle('is-selected',c===selected);
        });
        panel.replaceChildren();
        if(!selected){panel.hidden=true;layout.classList.remove('has-selection');return;}
        var name=selected.querySelector('.class-item-name');
        var detail=selected.querySelector('.class-item-detail');
        var title=document.createElement('h4');
        title.textContent=name?name.textContent.trim():'아이템 상세 정보';
        panel.appendChild(title);
        if(detail)panel.appendChild(detail.cloneNode(true));
        panel.hidden=false;layout.classList.add('has-selection');
      }
      cards.forEach(function(card){
        card.open=false;
        var summary=card.querySelector('summary');
        if(!summary)return;
        summary.setAttribute('aria-expanded','false');
        summary.addEventListener('click',function(ev){ev.preventDefault();select(card);});
        summary.addEventListener('keydown',function(ev){
          if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();select(card);}
        });
      });
    });
    var intro=document.querySelector('.class-items-page .class-intro');
    if(intro)intro.textContent='아이템을 클릭하면 상세 정보가 표시됩니다. 같은 아이템을 다시 클릭하면 닫힙니다.';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();