/* Small, dependency-free interactions. Media is loaded only when needed. */
(function() {
  'use strict';
  // Map the supplied cover directly onto the book: all printed details stay exact.
  var bookPhoto = document.querySelector('.collage-photo');
  var exactCover = document.querySelector('.exact-cover');
  if (bookPhoto && exactCover) {
    function fitCover() {
      var width = bookPhoto.clientWidth,
        height = bookPhoto.clientHeight;
      var scale = Math.max(width / 1088, height / 1445);
      var offsetX = (width - 1088 * scale) * .52;
      var offsetY = (height - 1445 * scale) * .65;
      var points = [
        [306, 566],
        [930, 543],
        [967, 1188],
        [325, 1199]
      ].map(function(p) {
        return [p[0] * scale + offsetX, p[1] * scale + offsetY];
      });
      var x0 = points[0][0],
        y0 = points[0][1],
        x1 = points[1][0],
        y1 = points[1][1],
        x2 = points[2][0],
        y2 = points[2][1],
        x3 = points[3][0],
        y3 = points[3][1];
      var dx1 = x1 - x2,
        dx2 = x3 - x2,
        dx3 = x0 - x1 + x2 - x3,
        dy1 = y1 - y2,
        dy2 = y3 - y2,
        dy3 = y0 - y1 + y2 - y3;
      var det = dx1 * dy2 - dx2 * dy1;
      if (!det) return;
      var g = (dx3 * dy2 - dx2 * dy3) / det,
        h = (dx1 * dy3 - dx3 * dy1) / det;
      var a = x1 - x0 + g * x1,
        b = x3 - x0 + h * x3,
        d = y1 - y0 + g * y1,
        e = y3 - y0 + h * y3;
      exactCover.style.transform = 'matrix3d(' + [a / 1000, d / 1000, 0, g / 1000, b / 1000, e / 1000, 0, h / 1000, 0, 0, 1, 0, x0, y0, 0, 1].join(',') + ')';
      exactCover.style.opacity = '1';
    }
    fitCover();
    if ('ResizeObserver' in window) new ResizeObserver(fitCover).observe(bookPhoto);
    else window.addEventListener('resize', fitCover);
  }

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-navigation');
  const productMenu = document.querySelector('.product-menu');

  if (productMenu) {
    const hoverMenu = window.matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
    let closeTimer;
    productMenu.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      if (hoverMenu.matches) productMenu.open = true;
    });
    productMenu.addEventListener('mouseleave', () => {
      if (!hoverMenu.matches) return;
      closeTimer = setTimeout(() => {
        if (!productMenu.querySelector('.product-dropdown').contains(document.activeElement)) productMenu.open = false;
      }, 180);
    });
    productMenu.querySelector('summary').addEventListener('click', e => {
      // A mouse click must not immediately close the menu just opened by hover.
      if (e.detail > 0 && hoverMenu.matches) {
        e.preventDefault();
        productMenu.open = true;
      }
    });
    productMenu.addEventListener('focusout', e => {
      if (!productMenu.contains(e.relatedTarget) && !productMenu.matches(':hover')) {
        clearTimeout(closeTimer);
        productMenu.open = false;
      }
    });
  }

  function closeMenu() {
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Buka menu');
    }
    if (nav) nav.classList.remove('is-open');
  }
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      closeMenu();
      if (productMenu) productMenu.open = false;
    }));
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      if (productMenu && productMenu.open) {
        productMenu.open = false;
        productMenu.querySelector('summary').focus();
      }
    }
  });
  document.addEventListener('click', e => {
    if (productMenu && !productMenu.contains(e.target)) productMenu.open = false;
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  const layers = [...document.querySelectorAll('[data-parallax]')];
  let frame = 0,
    active = true,
    mouseX = 0,
    mouseY = 0;

  function paint() {
    frame = 0;
    if (!hero || reduced.matches) return;
    const rect = hero.getBoundingClientRect();
    const distance = Math.min(hero.offsetHeight, Math.max(0, -rect.top));
    const factor = window.innerWidth < 601 ? .65 : 1;
    layers.forEach(layer => {
      const depth = Number(layer.dataset.parallax);
      layer.style.setProperty('--parallax-y', (distance * depth * factor + mouseY * depth * 28) + 'px');
      layer.style.setProperty('--parallax-x', (mouseX * depth * 60) + 'px');
    });
  }

  function schedule() {
    if (active && !frame) frame = requestAnimationFrame(paint);
  }
  if (hero) {
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      active = entries[0].isIntersecting;
      if (active) schedule();
    }).observe(hero);
    window.addEventListener('scroll', schedule, {
      passive: true
    });
    window.addEventListener('resize', schedule, {
      passive: true
    });
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      mouseX = (e.clientX - r.left) / r.width - .5;
      mouseY = (e.clientY - r.top) / r.height - .5;
      schedule();
    }, {
      passive: true
    });
    hero.addEventListener('pointerleave', () => {
      mouseX = 0;
      mouseY = 0;
      schedule();
    });
    schedule();
  }

  // Only visible cards respond to scroll. No animation library or idle loop.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionCards = [...document.querySelectorAll('.capability-card, .product-card, .film-grid > figure, .partner-mark, .activity-card, .crew-art, .world-gallery > figure, .concept-card, .game-exploration > figure, .character-test-film, .ark-cover-stage, .phone-duo > figure, .companion-demo, .worksheet-stack, [data-hover-scene]')];
  const visibleCards = new Set();
  let cardFrame = 0;

  function paintCards() {
    cardFrame = 0;
    if (reduced.matches || !finePointer.matches || document.hidden) return;
    const height = window.innerHeight;
    const positions = [...visibleCards].map(card => {
      const rect = card.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (height / 2 - rect.top - rect.height / 2) / (height / 2 + rect.height / 2)));
      return [card, progress * 15];
    });
    positions.forEach(([card, shift]) => card.style.setProperty('--scroll-shift', shift.toFixed(2) + 'px'));
  }

  function scheduleCards() {
    if (!cardFrame && !document.hidden && !reduced.matches && finePointer.matches) cardFrame = requestAnimationFrame(paintCards);
  }

  const cardObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleCards.add(entry.target);
      else visibleCards.delete(entry.target);
    });
    scheduleCards();
  }, {rootMargin: '50px'}) : null;

  motionCards.forEach(card => {
    card.classList.add('motion-card');
    card.querySelectorAll('.books-collage > figure, :scope > img, .ar-preview video, .kici-folder, .kici-2d, .kici-preview video, .kici-hero-world, .concept-motion img, .alamku-logo, .jejak-product-logo, .number-path, .video-frame video, :scope > .activity-art').forEach((art, index) => {
      art.classList.add('motion-art');
      art.style.setProperty('--depth', String(.55 + (index % 4) * .2));
    });
    if (cardObserver) cardObserver.observe(card);
    else visibleCards.add(card);
    let bounds;
    card.addEventListener('pointerenter', () => { bounds = card.getBoundingClientRect(); }, {passive: true});
    card.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || reduced.matches || !finePointer.matches || !bounds) return;
      const x = Math.max(-.5, Math.min(.5, (e.clientX - bounds.left) / bounds.width - .5));
      const y = Math.max(-.5, Math.min(.5, (e.clientY - bounds.top) / bounds.height - .5));
      card.style.setProperty('--tilt-x', (-y * 3).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', (x * 3).toFixed(2) + 'deg');
      card.style.setProperty('--pointer-x', (x * 15).toFixed(2) + 'px');
      card.style.setProperty('--pointer-y', (y * 10).toFixed(2) + 'px');
    }, {passive: true});
    card.addEventListener('pointerleave', () => {
      ['--tilt-x', '--tilt-y', '--pointer-x', '--pointer-y'].forEach(name => card.style.removeProperty(name));
      bounds = null;
    });
  });
  function resetCards() {
    motionCards.forEach(card => ['--scroll-shift', '--tilt-x', '--tilt-y', '--pointer-x', '--pointer-y'].forEach(name => card.style.removeProperty(name)));
    scheduleCards();
  }
  window.addEventListener('scroll', scheduleCards, {passive: true});
  window.addEventListener('resize', scheduleCards, {passive: true});
  reduced.addEventListener('change', resetCards);
  finePointer.addEventListener('change', resetCards);
  document.addEventListener('visibilitychange', scheduleCards);

  const films = [...document.querySelectorAll('[data-video-src]')];
  films.forEach(video => {
    const button = video.parentElement.querySelector('.play-button');
    button.addEventListener('click', async () => {
      films.forEach(other => {
        if (other !== video) other.pause();
      });
      if (!video.hasAttribute('src')) video.src = video.dataset.videoSrc;
      video.controls = true;
      try {
        await video.play();
        button.hidden = true;
      } catch (_) {
        button.hidden = false;
      }
    });
    video.addEventListener('play', () => {
      video.classList.add('is-playing');
      films.forEach(other => {
        if (other !== video) other.pause();
      });
      button.hidden = true;
    });
    video.addEventListener('pause', () => {
      video.classList.remove('is-playing');
      button.hidden = false;
    });
    video.addEventListener('ended', () => {
      video.classList.remove('is-playing');
      button.hidden = false;
    });
  });
  document.querySelectorAll('[data-gif-src]').forEach(img => {
    const button = img.parentElement.querySelector('.motion-toggle');
    const poster = img.getAttribute('src');
    const name = img.closest('figure').querySelector('figcaption strong').textContent;
    let visible = false,
      userPaused = false,
      playing = false;

    function showMotion(play) {
      if (playing === play) return;
      playing = play;
      img.src = play ? img.dataset.gifSrc : poster;
      button.textContent = play ? 'Ⅱ' : '▶';
      button.setAttribute('aria-label', (play ? 'Jeda konsep ' : 'Putar konsep ') + name);
    }
    button.addEventListener('click', () => {
      userPaused = playing;
      showMotion(!playing);
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      showMotion(visible && !reduced.matches && !userPaused && !document.hidden);
    }, {
      threshold: .3
    }).observe(img);
    document.addEventListener('visibilitychange', () => {
      showMotion(visible && !reduced.matches && !userPaused && !document.hidden);
    });
    reduced.addEventListener('change', () => {
      if (reduced.matches) showMotion(false);
    });
  });
  document.querySelectorAll('[data-loop-src]').forEach(video => {
    const button = (video.closest('[data-loop-container]') || video.parentElement).querySelector('.motion-toggle');
    const label = video.dataset.loopLabel || 'AR';
    let userPaused = false,
      visible = false,
      wanted = false;
    async function play() {
      wanted = true;
      if (!video.hasAttribute('src')) video.src = video.dataset.loopSrc;
      try {
        await video.play();
        if (!wanted) video.pause();
      } catch (_) {
        /* A browser may require a tap before inline playback. */
      }
    }
    function pause() {
      wanted = false;
      video.pause();
    }

    function sync() {
      button.textContent = video.paused ? '▶' : 'Ⅱ';
      button.setAttribute('aria-label', (video.paused ? 'Putar cuplikan ' : 'Jeda cuplikan ') + label);
      button.setAttribute('aria-pressed', String(!video.paused));
    }
    button.addEventListener('click', () => {
      if (video.paused) {
        userPaused = false;
        play();
      } else {
        userPaused = true;
        pause();
      }
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && !reduced.matches && !userPaused && !document.hidden) play();
      else pause();
    }, {
      threshold: .3
    }).observe(video);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pause();
      else if (visible && !reduced.matches && !userPaused) play();
    });
    reduced.addEventListener('change', () => {
      if (reduced.matches) pause();
    });
  });
})();
