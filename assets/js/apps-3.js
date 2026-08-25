
(function(){
  var warp = document.getElementById('warp-in');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (warp) {
    if (/[?&]warp=1/.test(location.search) && !reduced) {
      warp.classList.add('play');
      setTimeout(function () {
        warp.classList.add('done');
        setTimeout(function () { warp.remove(); }, 600);
      }, 1050);
    } else {
      warp.remove();
    }
  }
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('.warp-out').forEach(function (n) { n.remove(); });
  });
  document.querySelectorAll('.home-btn, .topbar .brand').forEach(function(link){
    link.addEventListener('click', function(e){
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault();
      var ov = document.createElement('div');
      ov.className = 'warp-out';
      ov.style.setProperty('--cx', e.clientX + 'px');
      ov.style.setProperty('--cy', e.clientY + 'px');
      ov.innerHTML =
        '<div class="wfill"></div>' +
        '<span class="wring"></span>' +
        '<span class="wring"></span>' +
        '<span class="wring"></span>' +
        '<span class="wlabel">// RETURNING : HOME</span>';
      document.body.appendChild(ov);
      setTimeout(function() { window.location.href = 'https://www.cncrsr.com/?warp=1'; }, 760);
    });
  });
})();
