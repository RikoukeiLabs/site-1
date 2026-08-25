
(function () {
  "use strict";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Warp arrival: plays only when coming from the Rikoukei site ---- */
  var warp = document.getElementById("warp-in");
  var fromWarp = /[?&]warp=1/.test(location.search);
  if (warp) {
    if (fromWarp && !reducedMotion) {
      warp.classList.add("play");
      setTimeout(function () {
        warp.classList.add("done");
        setTimeout(function () { warp.remove(); }, 600);
      }, 1050);
    } else {
      warp.remove();
    }
  }

  /* ---- Nav border accent on scroll (matches rikoukeilabs.com) ---- */
  var nav = document.getElementById("site-nav");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("nav-scrolled", window.scrollY > 40);
  }, { passive: true });

  /* ---- Section header glitch on first view ---- */
  var headers = document.querySelectorAll("h2");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var gio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("glitch-active");
          gio.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    headers.forEach(function (h) { gio.observe(h); });
  }

  /* ---- Custom cursor (fine pointers only) ---- */
  if (window.matchMedia("(pointer: fine)").matches) {
    var reticle = document.querySelector(".cursor-reticle");
    var ring = document.querySelector(".cursor-ring");
    document.body.classList.add("cursor-custom");
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      reticle.style.transform = "translate(" + mx + "px, " + my + "px) translate(-50%, -50%)";
    }, { passive: true });
    (function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = "translate(" + rx + "px, " + ry + "px) translate(-50%, -50%)";
      requestAnimationFrame(animateRing);
    })();
  }
})();
