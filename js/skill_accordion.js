document.addEventListener('click', (e)=>{
  const summary = e.target.closest('details.skill-acc > summary.skill-acc-summary');
  if(!summary) return;
  const current = summary.parentElement;
  document.querySelectorAll('details.skill-acc[open]').forEach(d=>{
    if(d!==current) d.open=false;
  });
});

// 자동 가나다 정렬 적용

function sortByKoreanName(arr){
  return arr.sort((a,b)=>a.name.trim().localeCompare(b.name.trim(),'ko'));
}

if(typeof tier1Items!=='undefined') sortByKoreanName(tier1Items);
if(typeof tier2Items!=='undefined') sortByKoreanName(tier2Items);
if(typeof tier3Items!=='undefined') sortByKoreanName(tier3Items);
