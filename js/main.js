/* ============================================================
   StoryGrove — interactions
   Header, nav, reveals, modals, parallax, journey, device,
   newsletter. Respects prefers-reduced-motion.
   ============================================================ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;
  var body = document.body;

  /* ---------- helpers ---------- */

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function onReady(fn) {
    if (document.readyState === 'complete') { fn(); } else { window.addEventListener('load', fn); }
  }

  /* ---------- hero load animation ---------- */

  onReady(function () {
    requestAnimationFrame(function () {
      body.classList.add('is-loaded');
    });
  });

  /* ---------- header + mobile nav ---------- */

  var header = document.getElementById('site-header');
  var nav = document.getElementById('site-nav');
  var navToggle = document.querySelector('.nav-toggle');

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  function closeNav() {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Buka menu');
    body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    if (open) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !navToggle.contains(e.target)) {
      closeNav();
    }
  });

  /* ---------- scroll reveals ---------- */

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.hasAttribute('data-reveal');
      });
      var idx = siblings.indexOf(el);
      el.style.setProperty('--d', clamp(idx * 0.09, 0, 0.42) + 's');
      el.classList.add('is-visible');
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    revealObserver.observe(el);
  });

  var imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      imageObserver.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.reveal-image').forEach(function (el) {
    imageObserver.observe(el);
  });

  /* ---------- active nav link ---------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a'));
  var sectionIds = navLinks.map(function (a) { return a.getAttribute('href'); });

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sectionIds.forEach(function (href) {
    var el;
    try { el = document.querySelector(href); } catch (err) { el = null; }
    if (el) sectionObserver.observe(el);
  });

  /* ---------- modal system ---------- */

  var modal = document.getElementById('modal');
  var modalBody = document.getElementById('modal-body');
  var lastFocused = null;

  var PRODUCTS = {
    storybook: {
      title: 'Buku Cerita',
      tag: 'Buku Cerita',
      status: 'Segera hadir',
      statusClass: 'is-soon',
      img: 'assets/storybook.jpg',
      imgSm: 'assets/storybook-sm.jpg',
      alt: 'Buku cerita StoryGrove',
      desc: 'Cerita bergambar yang membuka imajinasi dan pertanyaan baru — dengan dunia yang bisa terus dijelajahi setelah halaman terakhir ditutup.',
      related: 'Akan berjalan bersama <strong>Digital Companion</strong> agar dunianya terus hidup.'
    },
    games: {
      title: 'Play & Board',
      tag: 'Play & Board',
      status: 'Segera hadir',
      statusClass: 'is-soon',
      img: 'assets/games.jpg',
      imgSm: 'assets/games-sm.jpg',
      alt: 'Permainan papan dan kartu StoryGrove',
      desc: 'Permainan yang mengajak anak memilih, mencoba, dan bekerja sama — seru dimainkan bersama tanpa layar.',
      related: 'Terkait dengan <strong>Family Talk</strong>: keduanya dibangun dari semangat bermain yang sama.'
    },
    familytalk: {
      title: 'Family Talk',
      tag: 'Family Talk',
      status: 'Sudah tersedia',
      statusClass: 'is-live',
      img: 'assets/familytalk.jpg',
      imgSm: 'assets/familytalk-sm.jpg',
      alt: 'Family Talk — kartu percakapan keluarga StoryGrove',
      desc: 'Satu deck kartu untuk membuka cerita dan percakapan seru bersama keluarga. Lahir dari keinginan membuat waktu bersama terasa lebih dekat, ringan, dan menyenangkan.',
      related: 'Tersedia di dunia nyata — dan terus kami kembangkan lewat <strong>Play & Board</strong>.'
    },
    digital: {
      title: 'Digital Companion',
      tag: 'Digital Companion',
      status: 'Sedang dikembangkan',
      statusClass: 'is-soft',
      img: 'assets/digital.jpg',
      imgSm: 'assets/digital-sm.jpg',
      alt: 'Digital Companion StoryGrove di perangkat',
      desc: 'Pengalaman digital yang membuat cerita merespons — memberikan petunjuk, menunjukkan yang tidak terlihat, dan menjaga petualangan tetap berjalan.',
      related: 'Dirancang untuk selalu mengarahkan anak <strong>kembali ke dunia nyata</strong>.'
    },
    kit: {
      title: 'Learning Kit',
      tag: 'Learning Kit',
      status: 'Segera hadir',
      statusClass: 'is-soon',
      img: 'assets/kit.jpg',
      imgSm: 'assets/kit-sm.jpg',
      alt: 'Learning Kit — aktivitas dan eksperimen StoryGrove',
      desc: 'Aktivitas dan eksperimen yang membuat belajar terasa seperti petualangan — bahan yang bisa disentuh, dicoba, dan dikotori.',
      related: 'Akan terkait dengan <strong>Kici dan Pasukan Bumi</strong>.'
    }
  };

  var CHARACTERS = {
    kici: {
      name: 'Kici',
      role: 'Farmer & Explorer',
      img: 'assets/kici-illust.jpg',
      alt: 'Kici, kelinci biru yang bertualang',
      desc: 'Kelinci biru yang selalu ingin tahu. Ia berkebun, memperbaiki hal-hal yang ditinggalkan, dan suka bertanya — bahkan ketika tidak ada jawaban yang jelas.'
    },
    onyit: {
      name: 'Onyit',
      role: 'Mechanic',
      img: 'assets/kici-illust.jpg',
      alt: 'Onyit, monyet montir dengan kacamata',
      desc: 'Monyet kuning kecil dengan kacamata montir. Sang jenius suku cadang — mengubah besi tua dan barang bekas menjadi mesin yang benar-benar bekerja.'
    },
    miam: {
      name: 'Miam',
      role: 'Scout',
      img: 'assets/kici-world.jpg',
      alt: 'Miam, kucing pengintai Pasukan Bumi',
      desc: 'Kucing pink yang selalu berjalan paling depan. Ia melihat dunia dari tempat yang tidak terlihat orang lain, dan tahu jalur yang paling aman.'
    }
  };

  function modalProductHTML(p, key) {
    return (
      '<div class="modal-media"><img src="' + p.img + '" srcset="' + p.imgSm + ' 640w, ' + p.img + ' 1100w" sizes="520px" alt="' + p.alt + '" width="1100" height="825"></div>' +
      '<h3 id="modal-title">' + p.title + '</h3>' +
      '<span class="modal-status ' + p.statusClass + '">' + p.status + '</span>' +
      '<p>' + p.desc + '</p>' +
      '<p class="modal-related">' + p.related + '</p>' +
      '<a class="btn btn-primary modal-preorder-btn" href="preorder.html?produk=' + key + '">Pre-order ' + p.title + '</a>'
    );
  }

  function modalCharacterHTML(c) {
    return (
      '<div class="modal-character">' +
        '<div class="char-art"><img src="' + c.img + '" alt="' + c.alt + '" width="1500" height="844"></div>' +
        '<div>' +
          '<p class="char-role">' + c.role + '</p>' +
          '<h3 id="modal-title">' + c.name + '</h3>' +
          '<p>' + c.desc + '</p>' +
        '</div>' +
      '</div>'
    );
  }

  function openModal(html) {
    modalBody.innerHTML = html;
    lastFocused = document.activeElement;
    modal.hidden = false;
    body.style.overflow = 'hidden';
    var closeBtn = modal.querySelector('.modal-close');
    closeBtn.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    modalBody.innerHTML = '';
    body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function onModalKeydown(e) {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    var focusables = modal.querySelectorAll('button, a[href], input, [tabindex]');
    if (!focusables.length) return;
    var first = focusables[0];
    var lastEl = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
    else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
  }

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-modal-close]')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.hidden) onModalKeydown(e);
  });

  /* product cards */
  document.querySelectorAll('.product-card').forEach(function (card) {
    function open() {
      var key = card.getAttribute('data-product');
      var p = PRODUCTS[key];
      if (p) openModal(modalProductHTML(p, key));
    }
    card.addEventListener('click', open);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  /* programmatic open (feature CTA) */
  document.querySelectorAll('[data-open-product]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-open-product');
      var p = PRODUCTS[key];
      if (p) openModal(modalProductHTML(p, key));
    });
  });

  /* character hotspots */
  document.querySelectorAll('.hotspot').forEach(function (spot) {
    spot.addEventListener('click', function () {
      var c = CHARACTERS[spot.getAttribute('data-character')];
      if (c) openModal(modalCharacterHTML(c));
    });
  });

  /* ---------- journey progression ---------- */

  var journeySection = document.getElementById('cara');
  var journeyTrack = document.getElementById('journey-track');
  var journeyProgress = document.getElementById('journey-progress');
  var journeySteps = journeyTrack ? Array.prototype.slice.call(journeyTrack.querySelectorAll('.journey-step')) : [];
  var isMobileJourney = window.matchMedia('(max-width: 767px)');

  function setJourneyProgress(count) {
    var pct = (count / journeySteps.length) * 100;
    journeyProgress.style.setProperty('--fill', pct + '%');
  }

  function activateStep(idx) {
    journeySteps.forEach(function (step, i) {
      step.classList.toggle('is-active', i <= idx);
    });
    setJourneyProgress(idx + 1);
  }

  function updateJourneyScroll() {
    var rect = journeySection.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var denom = Math.max(rect.height - vh, 1);
    var progress = clamp((vh - rect.top) / denom, 0, 1);
    setJourneyProgress(progress * journeySteps.length);
    var activeCount = Math.ceil(progress * journeySteps.length);
    journeySteps.forEach(function (step, i) {
      step.classList.toggle('is-active', i < activeCount);
    });
  }

  var journeyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      activateStep(parseInt(entry.target.getAttribute('data-step'), 10));
    });
  }, { threshold: 0.6 });

  if (journeyTrack) {
    if (isMobileJourney.matches) {
      journeySteps.forEach(function (step) { journeyObserver.observe(step); });
    } else {
      updateJourneyScroll();
      window.addEventListener('scroll', updateJourneyScroll, { passive: true });
    }
    window.addEventListener('resize', function () {
      if (isMobileJourney.matches) {
        journeySteps.forEach(function (step) { journeyObserver.observe(step); });
      } else {
        updateJourneyScroll();
      }
    });
  }

  /* ---------- device screen toggle ---------- */

  var device = document.getElementById('tech-device');
  if (device) {
    var screens = Array.prototype.slice.call(device.querySelectorAll('.device-screen-img'));
    var active = 0;
    var pinned = false;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    function show(i) {
      screens.forEach(function (s, idx) {
        s.classList.toggle('is-active', idx === i);
      });
      active = i;
    }

    device.querySelector('[data-device-toggle]').addEventListener('click', function () {
      pinned = true;
      show(active === 0 ? 1 : 0);
    });

    if (finePointer.matches) {
      device.addEventListener('mouseenter', function () {
        if (!pinned) show(active === 0 ? 1 : 0);
      });
      device.addEventListener('mouseleave', function () {
        if (!pinned) show(active);
      });
    }
  }

  /* ---------- parallax (kici + hero) ---------- */

  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var heroMedia = document.querySelector('.hero-media');
  if (heroMedia) heroMedia.setAttribute('data-parallax', '');

  var tick = false;
  function applyParallax() {
    tick = false;
    parallaxEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;
      var speed = el.getAttribute('data-parallax') === 'bg' ? -0.05 : 0.02;
      if (el === heroMedia) speed = 0.025;
      var vh = window.innerHeight;
      var center = rect.top + rect.height / 2;
      var offset = ((center - vh / 2) / vh) * -1;
      var y = offset * speed * 1600;
      el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    });
  }

  function onScrollParallax() {
    if (prefersReducedMotion) return;
    if (!tick) {
      tick = true;
      requestAnimationFrame(applyParallax);
    }
  }

  if (parallaxEls.length && !prefersReducedMotion && !isTouch) {
    window.addEventListener('scroll', onScrollParallax, { passive: true });
    window.addEventListener('resize', onScrollParallax);
    applyParallax();
  }

  /* ---------- newsletter ---------- */

  var newsletterForm = document.getElementById('newsletter-form');
  var newsletterStatus = document.getElementById('newsletter-status');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input[type="email"]');
      var email = input.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newsletterStatus.textContent = 'Hmm, sepertinya emailnya belum lengkap. Coba lagi ya.';
        newsletterStatus.style.color = '#C55E1D';
        input.focus();
        return;
      }
      newsletterStatus.textContent = 'Terima kasih sudah mampir — nanti ada kabar dari dunia StoryGrove untukmu.';
      newsletterStatus.style.color = '';
      newsletterForm.reset();
    });
  }

  /* ---------- footer year ---------- */

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  window.STORYGROVE_PRODUCTS = PRODUCTS;
})();
