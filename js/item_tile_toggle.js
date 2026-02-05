document.addEventListener('click', function(e){
  var btn = e.target.closest('.tile-btn');
  if(!btn) return;

  var tile = btn.closest('.tile');
  if(!tile) return;

  var detail = tile.querySelector('.tile-detail');
  if(!detail) return;

  var expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  detail.hidden = expanded;

  btn.textContent = expanded ? '상세' : '접기';
});
