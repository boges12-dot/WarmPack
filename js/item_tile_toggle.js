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


// 자동 가나다 정렬 적용

function sortByKoreanName(arr){
  return arr.sort((a,b)=>a.name.trim().localeCompare(b.name.trim(),'ko'));
}

if(typeof tier1Items!=='undefined') sortByKoreanName(tier1Items);
if(typeof tier2Items!=='undefined') sortByKoreanName(tier2Items);
if(typeof tier3Items!=='undefined') sortByKoreanName(tier3Items);


document.addEventListener('DOMContentLoaded', function(){
  // Move preview "옵션/획득" into expanded detail area and remove from preview.
  document.querySelectorAll('.tile').forEach(function(tile){
    var sub2s = Array.from(tile.querySelectorAll('.tile-sub2'));
    var detail = tile.querySelector('.tile-detail');
    if(!detail || sub2s.length === 0) return;

    function stripLabel(html, label){
      var re = new RegExp('^\\s*' + label + '\\s*:?\\s*', 'i');
      return (html || '').trim().replace(re, '').trim();
    }

    var optVal = stripLabel(sub2s[0].innerHTML, '옵션');
    var acqVal = sub2s[1] ? stripLabel(sub2s[1].innerHTML, '획득') : '';

    // Remove preview lines
    sub2s.forEach(function(el){ el.remove(); });

    // Remove small kv lines above item detail (direct children of .tile-detail)
    Array.from(detail.children).forEach(function(ch){
      if(ch.classList && ch.classList.contains('kv')) ch.remove();
    });

    // Build extra block
    var extra = document.createElement('div');
    extra.className = 'tile-extra';

    function makeRow(label, valueHTML){
      if(!valueHTML) return null;
      var row = document.createElement('div');
      row.className = 'tile-extra-row';

      var l = document.createElement('div');
      l.className = 'tile-extra-label';
      l.textContent = label;

      var v = document.createElement('div');
      v.className = 'tile-extra-value';
      v.innerHTML = valueHTML;

      row.appendChild(l);
      row.appendChild(v);
      return row;
    }

    var r1 = makeRow('옵션', optVal);
    var r2 = makeRow('획득', acqVal);
    if(r1) extra.appendChild(r1);
    if(r2) extra.appendChild(r2);

    // Append after the main detail block
    detail.appendChild(extra);
  });
});
