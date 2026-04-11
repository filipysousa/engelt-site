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


/* ── Contact form — envia via PHP ── */
(function () {
  var form = document.getElementById('contatoForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    var data = new FormData(form);

    fetch('enviar.php', { method: 'POST', body: data })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.ok) {
          btn.textContent = 'Mensagem Enviada!';
          btn.style.background = '#22c55e';
          form.reset();
          setTimeout(function () {
            btn.textContent = 'Enviar Mensagem';
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        } else {
          btn.textContent = 'Erro — tente novamente';
          btn.style.background = '#ef4444';
          btn.disabled = false;
          setTimeout(function () {
            btn.textContent = 'Enviar Mensagem';
            btn.style.background = '';
          }, 4000);
          alert(json.msg || 'Erro ao enviar. Tente novamente.');
        }
      })
      .catch(function () {
        btn.textContent = 'Erro de conexão';
        btn.style.background = '#ef4444';
        btn.disabled = false;
        setTimeout(function () {
          btn.textContent = 'Enviar Mensagem';
          btn.style.background = '';
        }, 4000);
        alert('Erro de conexão. Tente novamente ou ligue para (85) 3279-6330.');
      });
  });
})();


/* ── Portfólio Lightbox ── */
(function () {
  var obras = [
    {
      titulo: 'SE 500 kV Cristino Castro',
      fotos: [
        'img/obras/secristinocastro500kv/subestacao.jpeg',
        'img/obras/secristinocastro500kv/01.jpeg',
        'img/obras/secristinocastro500kv/02.jpeg',
        'img/obras/secristinocastro500kv/equipe.jpeg',
        'img/obras/secristinocastro500kv/equipe02.jpeg',
        'img/obras/secristinocastro500kv/equipe03.jpeg'
      ]
    },
    {
      titulo: 'LT 500 kV Serra do Seridó – Santa Luzia II',
      fotos: [
        'img/obras/lt-seridosantaluzia/Imagem9.jpg',
        'img/obras/lt-seridosantaluzia/Imagem10.jpg',
        'img/obras/lt-seridosantaluzia/Imagem11.jpg',
        'img/obras/lt-seridosantaluzia/Imagem12.jpg',
        'img/obras/lt-seridosantaluzia/Imagem13.jpg',
        'img/obras/lt-seridosantaluzia/Imagem14.jpg'
      ]
    },
    {
      titulo: 'LT 500 kV UTE GNA II – Campos II',
      fotos: [
        'img/obras/lt-gnacampos/01.jpg',
        'img/obras/lt-gnacampos/02.jpg',
        'img/obras/lt-gnacampos/Imagem3.jpg',
        'img/obras/lt-gnacampos/Imagem4.jpg',
        'img/obras/lt-gnacampos/Imagem5.jpg',
        'img/obras/lt-gnacampos/Imagem6.jpg',
        'img/obras/lt-gnacampos/Imagem7.jpg',
        'img/obras/lt-gnacampos/Imagem8.jpg'
      ]
    },
    {
      titulo: 'LT 230 kV Caetité Norte – Igaporã III',
      fotos: [
        'img/obras/lt-caetite/Imagem15.jpg',
        'img/obras/lt-caetite/Imagem16.jpg',
        'img/obras/lt-caetite/Imagem17.jpg',
        'img/obras/lt-caetite/Imagem18.jpg',
        'img/obras/lt-caetite/Imagem19.jpg',
        'img/obras/lt-caetite/Imagem20.jpg',
        'img/obras/lt-caetite/Imagem21.jpg'
      ]
    },
    {
      titulo: 'RMT Solar Serra do Mato – Trairi',
      fotos: [
        'img/obras/rmt-trairi/Imagem22.jpg',
        'img/obras/rmt-trairi/Imagem23.jpg'
      ]
    }
  ];

  var lb         = document.getElementById('lightbox');
  var lbImg      = document.getElementById('lbImg');
  var lbTitle    = document.getElementById('lbTitle');
  var lbCounter  = document.getElementById('lbCounter');
  var lbClose    = document.getElementById('lbClose');
  var lbPrev     = document.getElementById('lbPrev');
  var lbNext     = document.getElementById('lbNext');
  var lbBackdrop = document.getElementById('lbBackdrop');
  if (!lb) return;

  var current = { obra: 0, foto: 0 };

  function openLightbox(obraIdx) {
    current.obra = obraIdx;
    current.foto = 0;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderFoto(0);
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderFoto(dir) {
    var obra  = obras[current.obra];
    var total = obra.fotos.length;
    lbTitle.textContent   = obra.titulo;
    lbCounter.textContent = (current.foto + 1) + ' / ' + total;
    lbPrev.style.display  = total > 1 ? '' : 'none';
    lbNext.style.display  = total > 1 ? '' : 'none';

    if (dir !== 0) {
      lbImg.style.setProperty('--lb-dir', dir > 0 ? '50px' : '-50px');
      lbImg.classList.add('lb-fade');
    }

    var src = obra.fotos[current.foto];
    var tmp = new Image();
    tmp.onload = function () {
      lbImg.src = src;
      if (dir !== 0) {
        lbImg.style.setProperty('--lb-dir', dir > 0 ? '-50px' : '50px');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { lbImg.classList.remove('lb-fade'); });
        });
      }
    };
    tmp.src = src;
    if (dir === 0) lbImg.src = src;
  }

  function navFoto(dir) {
    var total = obras[current.obra].fotos.length;
    current.foto = (current.foto + dir + total) % total;
    renderFoto(dir);
  }

  document.querySelectorAll('.portfolio-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openLightbox(parseInt(card.getAttribute('data-obra'), 10));
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function (e) { e.stopPropagation(); navFoto(-1); });
  lbNext.addEventListener('click', function (e) { e.stopPropagation(); navFoto(1); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') navFoto(1);
    if (e.key === 'ArrowLeft')  navFoto(-1);
  });

  var touchX = null;
  lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navFoto(diff > 0 ? 1 : -1);
    touchX = null;
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
