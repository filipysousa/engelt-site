/* ═══════════════════════════════════════════════════════════
   ENGELT ENGENHARIA — script.js
   ═══════════════════════════════════════════════════════════ */

/* ── Navbar: scroll effect + mobile toggle ── */
(function () {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  // Scroll
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  navToggle.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
    // Animate hamburger
    navToggle.querySelectorAll('span').forEach(function (s, i) {
      s.style.transform = open
        ? (i === 0 ? 'translateY(7px) rotate(45deg)'
         : i === 1 ? 'scaleX(0)'
         :           'translateY(-7px) rotate(-45deg)')
        : '';
      s.style.opacity = (open && i === 1) ? '0' : '1';
    });
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      navToggle.querySelectorAll('span').forEach(function (s) {
        s.style.transform = '';
        s.style.opacity   = '1';
      });
    });
  });
})();


/* ── Animate on Scroll ── */
(function () {
  var items = document.querySelectorAll('[data-aos]');
  if (!items.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, idx) {
      if (entry.isIntersecting) {
        // Stagger siblings
        var siblings = Array.from(entry.target.parentElement.children);
        var i = siblings.indexOf(entry.target);
        setTimeout(function () {
          entry.target.classList.add('aos-visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (el) { observer.observe(el); });
})();


/* ── Counter Animation ── */
(function () {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCount(el) {
    var target   = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1800;
    var start    = null;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value    = Math.floor(easeOutCubic(progress) * target);
      el.textContent = value >= 1000
        ? value.toLocaleString('pt-BR')
        : value;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target >= 1000
        ? target.toLocaleString('pt-BR')
        : target;
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
})();


/* ── Active nav link on scroll ── */
(function () {
  var sections = document.querySelectorAll('section[id]');
  var links    = document.querySelectorAll('.navbar__links a[href^="#"]');
  if (!sections.length || !links.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (link) {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--orange)';
          }
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -60% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();


/* ── Contact form (frontend only) ── */
(function () {
  var form = document.getElementById('contatoForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Simulate send delay — replace with fetch() to your backend
    setTimeout(function () {
      btn.textContent = 'Mensagem Enviada!';
      btn.style.background = '#22c55e';
      form.reset();

      setTimeout(function () {
        btn.textContent = 'Enviar Mensagem';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
})();


/* ── Smooth scroll polyfill for older browsers ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
