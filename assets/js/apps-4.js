
(function(){
  var modal = document.getElementById('leave-modal');
  var desc = document.getElementById('lm-desc-txt');
  var pendingHref = null;
  document.querySelectorAll('.sat a, .core-btn').forEach(function(a){
    a.addEventListener('click', function(e){
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      pendingHref = a.getAttribute('href');
      desc.textContent = a.getAttribute('data-desc') || '';
      modal.classList.add('open');
    });
  });
  function close(){ modal.classList.remove('open'); pendingHref = null; }
  modal.querySelector('.lm-yes').addEventListener('click', function(){
    if (pendingHref) window.open(pendingHref, '_blank', 'noopener');
    close();
  });
  modal.querySelector('.lm-no').addEventListener('click', close);
  modal.querySelector('.lm-close').addEventListener('click', close);
  modal.addEventListener('click', function(e){ if (e.target === modal) close(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
})();
