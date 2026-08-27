
(function () {
  "use strict";

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!revealEls.length) return;

  function show(el) { el.classList.add("visible"); }
  function showAll() { revealEls.forEach(show); }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  // Anything already on screen at load is revealed straight away, measured directly rather than waiting for the observer to deliver its first callback. This is a reading page: it must never render blank.
  revealEls.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) show(el);
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        show(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  revealEls.forEach(function (el) {
    if (!el.classList.contains("visible")) io.observe(el);
  });

  // Failsafe. If the observer never delivers, for any reason, the content still appears rather than leaving the reader with an empty page.
  window.setTimeout(showAll, 1500);
})();
