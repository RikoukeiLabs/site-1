
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobileMQ = window.matchMedia("(max-width: 768px)");

  /* ============ Starfield with scroll parallax ============ */
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
      var depth = 0.2 + Math.random() * 0.8; // farther = slower parallax
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

  function drawStars(scrollY) {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var y = (s.y - scrollY * s.depth * 0.12) % H;
      if (y < 0) y += H;
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, 6.2832);
      ctx.fillStyle = "rgba(" + s.color + "," + s.a + ")";
      ctx.fill();
    }
  }

  /* ============ Orrery scroll assembly ============ */
  var orrery = document.getElementById("orrery");
  var strokes = Array.prototype.slice.call(orrery.querySelectorAll(".lp"));
  var dots = Array.prototype.slice.call(orrery.querySelectorAll(".ld"));

  // Build the assembly order: interleave in document order (strokes and dots
  // already alternate naturally through the four quadrant groups).
  var pieces = Array.prototype.slice.call(orrery.querySelectorAll(".lp, .ld"));
  var N = pieces.length;
  var ASSEMBLY_END = 0.96; // fully assembled just as the footer arrives

  pieces.forEach(function (el) {
    if (el.classList.contains("lp")) {
      var len = el.getTotalLength();
      el.dataset.len = len;
      el.style.strokeDasharray = len + " " + len;
      el.style.strokeDashoffset = len;
      el.style.opacity = "0";
    } else {
      el.style.opacity = "0";
      el.style.transformBox = "fill-box";
      el.style.transformOrigin = "center";
      el.style.transform = "scale(0.2)";
    }
  });

  function setPieceProgress(el, t) {
    if (el.classList.contains("lp")) {
      var len = parseFloat(el.dataset.len);
      el.style.strokeDashoffset = String(len * (1 - t));
      el.style.opacity = String(Math.min(1, t * 2.5));
    } else {
      el.style.opacity = String(t);
      el.style.transform = "scale(" + (0.2 + 0.8 * t) + ")";
    }
  }

  function completeAllPieces() {
    pieces.forEach(function (el) { setPieceProgress(el, 1); });
  }

  var mobileAssembled = false;

  function updateAssembly(p) {
    // p = overall page scroll progress, 0..1
    var ap = Math.max(0, Math.min(1, p / ASSEMBLY_END));

    if (mobileMQ.matches) {
      // Mobile: simple whole-logo fade-in instead of a per-piece draw.
      // Pieces are completed once, then only the container opacity changes.
      if (!mobileAssembled) { completeAllPieces(); mobileAssembled = true; }
      orrery.style.opacity = String(0.05 + ap * 0.2);
    } else {
      mobileAssembled = false;
      orrery.style.opacity = "";
      var span = 1 / N;           // each piece owns a slice of the scroll
      var overlap = 1.9;          // pieces overlap so assembly feels continuous
      for (var i = 0; i < N; i++) {
        var start = (i / N) * (1 - span * overlap);
        var t = (ap - start) / (span * overlap);
        setPieceProgress(pieces[i], Math.max(0, Math.min(1, t)));
      }
    }
  }

  /* ============ Ambient star drift (same slow drift as the apps page) ============ */
  var starDrift = 0;
  var drifting = false;
  function startDrift() {
    if (drifting || reducedMotion) return;
    drifting = true;
    (function tick() {
      if (mobileMQ.matches) { drifting = false; drawStars(window.scrollY); return; }
      starDrift += 0.5;
      drawStars(window.scrollY + starDrift);
      requestAnimationFrame(tick);
    })();
  }

  /* ============ Scroll loop (rAF-throttled) ============ */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var doc = document.documentElement;
      var max = Math.max(1, doc.scrollHeight - window.innerHeight);
      var p = Math.max(0, Math.min(1, window.scrollY / max));
      updateAssembly(p);
      // Mobile: skip the per-scroll parallax redraw; stars stay static.
      // Desktop: when the drift loop runs it already redraws every frame.
      if (!mobileMQ.matches && !drifting) drawStars(window.scrollY + starDrift);
      ticking = false;
    });
  }

  if (reducedMotion) {
    // Show everything, fully assembled, no scroll-linked motion.
    completeAllPieces();
    orrery.style.opacity = "0.25";
    initStars();
    drawStars(0);
  } else {
    initStars();
    drawStars(0);
    // Initialize assembly state synchronously; the first rAF can be delayed.
    updateAssembly(Math.max(0, Math.min(1,
      window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))));
    onScroll();
    if (!mobileMQ.matches) startDrift();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { initStars(); drawStars(0); onScroll(); });
    mobileMQ.addEventListener && mobileMQ.addEventListener("change", function () {
      initStars();
      drawStars(0);
      onScroll();
      if (!mobileMQ.matches) startDrift();
    });
  }

  /* ============ Section reveals ============ */
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

})();
