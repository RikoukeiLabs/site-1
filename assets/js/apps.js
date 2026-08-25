
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobileMQ = window.matchMedia("(max-width: 768px)");

  /* ============ Starfield (same engine as home page, slow ambient drift) ============ */
  var canvas = document.getElementById("starfield");
  var ctx = canvas.getContext("2d");
  var stars = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;

  function initStars() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = [];
    // Fewer stars on mobile: less canvas work per frame.
    var cap = mobileMQ.matches ? 110 : 260;
    var count = Math.min(cap, Math.floor(W * H / 6500));
    for (var i = 0; i < count; i++) {
      var depth = 0.2 + Math.random() * 0.8; // farther = slower drift
      var tint = Math.random();
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: depth * 1.25 * (0.5 + Math.random() * 0.7),
        depth: depth,
        a: 0.25 + Math.random() * 0.55,
        color: tint > 0.92 ? "255,198,126" : (tint > 0.86 ? "190,92,216" : "224,224,224")
      });
    }
  }

  function drawStars(offset) {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var y = (s.y - offset * s.depth * 0.12) % H;
      if (y < 0) y += H;
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, 6.2832);
      ctx.fillStyle = "rgba(" + s.color + "," + s.a + ")";
      ctx.fill();
    }
  }

  // Desktop: sub-pixel drift on rAF (smooth, unlike background-position
  // animation which snaps to integer pixels). Mobile / reduced motion: static.
  var drifting = false;
  function startDrift() {
    if (drifting || reducedMotion) return;
    drifting = true;
    var t = 0;
    (function tick() {
      if (mobileMQ.matches) { drifting = false; drawStars(0); return; }
      t += 0.5;
      drawStars(t);
      requestAnimationFrame(tick);
    })();
  }

  initStars();
  drawStars(0);
  if (!mobileMQ.matches) startDrift();
  window.addEventListener("resize", function () { initStars(); drawStars(0); });
  mobileMQ.addEventListener && mobileMQ.addEventListener("change", function () {
    initStars();
    drawStars(0);
    if (!mobileMQ.matches) startDrift();
  });

  /* ============ Section reveals (same as home page) ============ */
  var revealEls = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ============ Custom cursor (same as home page, fine pointers only) ============ */
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
