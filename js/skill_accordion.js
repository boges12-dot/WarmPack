document.addEventListener('click', (e)=>{
  const summary = e.target.closest('details.skill-acc > summary.skill-acc-summary');
  if(!summary) return;
  const current = summary.parentElement;
  document.querySelectorAll('details.skill-acc[open]').forEach(d=>{
    if(d!==current) d.open=false;
  });
});