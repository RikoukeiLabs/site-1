
(function(){
  var link = document.getElementById('products-link');
  if (!link) return;
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('.warp-out').forEach(function (n) { n.remove(); });
  });
  link.addEventListener('click', function (e) {
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
      '<span class="wlabel">// LAUNCHING : ECOSYSTEM</span>';
    document.body.appendChild(ov);
    setTimeout(function () { window.location.href = link.getAttribute('href') + '?warp=1'; }, 760);
  });
})();
