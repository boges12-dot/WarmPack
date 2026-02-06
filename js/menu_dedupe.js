document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('ul.submenu').forEach(ul=>{
    const seen = new Set();
    ul.querySelectorAll('li').forEach(li=>{
      const a = li.querySelector('a');
      if(!a) return;
      const key = (a.getAttribute('href')||'') + '|' + (a.textContent||'').trim();
      if(seen.has(key)){
        li.remove();
      } else {
        seen.add(key);
      }
    });
  });
});

// 자동 가나다 정렬 적용

function sortByKoreanName(arr){
  return arr.sort((a,b)=>a.name.trim().localeCompare(b.name.trim(),'ko'));
}

if(typeof tier1Items!=='undefined') sortByKoreanName(tier1Items);
if(typeof tier2Items!=='undefined') sortByKoreanName(tier2Items);
if(typeof tier3Items!=='undefined') sortByKoreanName(tier3Items);
