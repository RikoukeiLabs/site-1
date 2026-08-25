
(function(){
  var modal=document.getElementById('contact-modal');
  var mailtoLink=document.getElementById('cm-mailto');
  var copyBtn=modal.querySelector('.cm-copy');
  var emailEl=modal.querySelector('.cm-email');
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
    if(modal.contains(a))return;
    a.addEventListener('click',function(e){
      e.preventDefault();
      mailtoLink.setAttribute('href',a.getAttribute('href'));
      modal.classList.add('open');
    });
  });
  function close(){modal.classList.remove('open');}
  modal.querySelector('.cm-close').addEventListener('click',close);
  modal.addEventListener('click',function(e){if(e.target===modal)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  copyBtn.addEventListener('click',function(){
    var t=emailEl.textContent;
    function ok(){copyBtn.textContent='COPIED';setTimeout(function(){copyBtn.textContent='COPY';},1600);}
    function fallback(){var r=document.createRange();r.selectNodeContents(emailEl);var s=getSelection();s.removeAllRanges();s.addRange(r);try{document.execCommand('copy');ok();}catch(err){}}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,fallback);}else{fallback();}
  });
})();
