
(function(){
  var modal=document.getElementById('referral-modal');
  var opener=document.getElementById('ref-open');
  if(!modal||!opener)return;
  var copyBtn=modal.querySelector('.cm-copy');
  var emailEl=modal.querySelector('.cm-email');
  function close(){modal.classList.remove('open');}
  opener.addEventListener('click',function(e){e.preventDefault();modal.classList.add('open');});
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
