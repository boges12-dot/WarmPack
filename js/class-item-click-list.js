(function(){
 function init(){
  document.querySelectorAll('.class-items-page .class-item-grid').forEach(function(grid){
   var cards=Array.from(grid.querySelectorAll(':scope > details.class-item-card'));
   if(!cards.length)return;
   cards.forEach(function(card){
    card.open=false;
    card.addEventListener('toggle',function(){
     if(!card.open)return;
     cards.forEach(function(other){if(other!==card)other.open=false;});
    });
   });
  });
  var intro=document.querySelector('.class-items-page .class-intro');
  if(intro)intro.textContent='아이템을 클릭하면 바로 아래에 상세 정보가 펼쳐집니다. 다시 클릭하면 닫힙니다.';
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
