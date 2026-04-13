/* ═══════════════════════════════════════════════════════════
   ENGELT ENGENHARIA — script.js
   ═══════════════════════════════════════════════════════════ */

/* ── Hero slideshow ── */
(function () {
  var slides   = document.querySelectorAll('.hero__slide');
  var label    = document.getElementById('heroLabel');
  var dotsWrap = document.getElementById('heroDots');
  if (!slides.length) return;

  var current = 0;
  var dots    = [];

  // Build dots
  slides.forEach(function (_, i) {
    var d = document.createElement('button');
    d.className = 'hero__dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Foto ' + (i + 1));
    d.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(d);
    dots.push(d);
  });

  // Preload all slide backgrounds so they don't flicker
  slides.forEach(function (slide) {
    var bg = slide.style.backgroundImage;
    var m  = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (m) { var img = new Image(); img.src = m[1]; }
  });

  function updateLabel(idx) {
    if (!label) return;
    label.style.opacity = '0';
    setTimeout(function () {
      label.textContent = slides[idx].getAttribute('data-label') || '';
      label.style.opacity = '1';
    }, 400);
  }

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    void slides[current].offsetWidth; // force reflow → restart Ken Burns
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    updateLabel(current);
  }

  updateLabel(0);

  // Timer sempre corre — nunca é cancelado, nunca é pausado
  setInterval(function () {
    goTo((current + 1) % slides.length);
  }, 6000);
})();


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


/* ── Portfólio — Album Grid + Viewer ── */
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

  var modal      = document.getElementById('albumModal');
  var bgSlidesCt = document.getElementById('albumBgSlides');
  var albumTitle = document.getElementById('albumTitle');
  var albumGrid  = document.getElementById('albumGrid');
  var albumClose = document.getElementById('albumClose');
  var viewer     = document.getElementById('albumViewer');
  var viewerImg  = document.getElementById('viewerImg');
  var viewerCnt  = document.getElementById('viewerCounter');
  var viewerClose = document.getElementById('viewerClose');
  var viewerPrev  = document.getElementById('viewerPrev');
  var viewerNext  = document.getElementById('viewerNext');
  if (!modal || !viewer) return;

  var currentObra = null;
  var currentFoto = 0;
  var bgTimer     = null;
  var bgCurrent   = 0;
  var bgEls       = [];

  function openAlbum(obraIdx) {
    currentObra = obras[obraIdx];
    currentFoto = 0;
    albumTitle.textContent = currentObra.titulo;

    // Fundo animado
    bgSlidesCt.innerHTML = '';
    bgEls = [];
    bgCurrent = 0;
    currentObra.fotos.forEach(function (src, i) {
      var el = document.createElement('div');
      el.className = 'album-bg-slide' + (i === 0 ? ' active' : '');
      el.style.backgroundImage = "url('" + src + "')";
      bgSlidesCt.appendChild(el);
      bgEls.push(el);
    });
    clearInterval(bgTimer);
    if (bgEls.length > 1) {
      bgTimer = setInterval(function () {
        bgEls[bgCurrent].classList.remove('active');
        bgCurrent = (bgCurrent + 1) % bgEls.length;
        bgEls[bgCurrent].classList.add('active');
      }, 7000);
    }

    // Grade de fotos
    albumGrid.innerHTML = '';
    currentObra.fotos.forEach(function (src, i) {
      var thumb = document.createElement('div');
      thumb.className = 'album-thumb';
      var img = document.createElement('img');
      img.src = src;
      img.alt = currentObra.titulo + ' — foto ' + (i + 1);
      thumb.appendChild(img);
      thumb.addEventListener('click', function () { openViewer(i); });
      albumGrid.appendChild(thumb);
    });

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAlbum() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearInterval(bgTimer);
  }

  function openViewer(idx) {
    currentFoto = idx;
    renderViewer();
    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden', 'false');
  }

  function closeViewer() {
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden', 'true');
  }

  function renderViewer() {
    viewerImg.src = currentObra.fotos[currentFoto];
    viewerCnt.textContent = (currentFoto + 1) + ' / ' + currentObra.fotos.length;
  }

  function navViewer(dir) {
    var total = currentObra.fotos.length;
    currentFoto = (currentFoto + dir + total) % total;
    renderViewer();
  }

  document.querySelectorAll('.portfolio-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openAlbum(parseInt(card.getAttribute('data-obra'), 10));
    });
  });

  albumClose.addEventListener('click', closeAlbum);
  document.getElementById('albumModal').querySelector('.album-modal__inner').addEventListener('click', function (e) {
    if (e.target === this) closeAlbum();
  });
  viewerClose.addEventListener('click', closeViewer);
  viewerPrev.addEventListener('click', function (e) { e.stopPropagation(); navViewer(-1); });
  viewerNext.addEventListener('click', function (e) { e.stopPropagation(); navViewer(1); });

  document.addEventListener('keydown', function (e) {
    if (viewer.classList.contains('open')) {
      if (e.key === 'Escape')     closeViewer();
      if (e.key === 'ArrowRight') navViewer(1);
      if (e.key === 'ArrowLeft')  navViewer(-1);
    } else if (modal.classList.contains('open')) {
      if (e.key === 'Escape') closeAlbum();
    }
  });

  var touchX = null;
  viewer.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navViewer(diff > 0 ? 1 : -1);
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
