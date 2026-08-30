/* ============================================================
   Storygrove — landing page interactions
   Parallax hero layers + scroll reveal. Respects prefers-reduced-motion
   (handled primarily via CSS; this JS still runs but the CSS neutralizes it).
   ============================================================ */

(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    var frame = 0;

    function updateParallax() {
      frame = 0;
      var scrollTop = Math.min(window.scrollY, window.innerHeight * 1.05);
      layers.forEach(function (layer) {
        var speed = Number(layer.dataset.parallax || 0);
        layer.style.setProperty('--parallax-y', (scrollTop * speed) + 'px');
      });
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    }

    if (layers.length) {
      updateParallax();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    var revealItems = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
      );
      revealItems.forEach(function (item) { observer.observe(item); });
    } else {
      revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    }

    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
