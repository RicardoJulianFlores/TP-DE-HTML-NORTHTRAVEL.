/* ═══════════════════════════════════════════
   WANDERLUST — MAIN.JS
   jQuery + interactividad general
   Requiere jQuery 3.x cargado antes
═══════════════════════════════════════════ */

$(function () {

  /* ─── 1. DARK MODE + LOGO ────────────────
     Sincroniza el toggle de tema con el logo
  ─────────────────────────────────────────── */
  const $html  = $('html');
  const $logo  = $('#logoimg');
  const saved  = localStorage.getItem('theme');

  function updateLogo(theme) {
    $logo.fadeTo(150, 0, function () {
      $logo.attr('src', theme === 'dark' ? $logo.data('dark') : $logo.data('light'));
      $logo.fadeTo(150, 1);
    });
  }

  if (saved) {
    $html.attr('data-theme', saved);
    updateLogo(saved);
  }

  $('#themeToggle').on('click', function () {
    const t = $html.attr('data-theme') === 'dark' ? 'light' : 'dark';
    $html.attr('data-theme', t);
    localStorage.setItem('theme', t);
    updateLogo(t);
  });


  /* ─── 2. HAMBURGER MENÚ MÓVIL ────────────
     Abre / cierra el nav en pantallas pequeñas
  ─────────────────────────────────────────── */
  $('#hamburgerBtn').on('click', function () {
    const $nl   = $('.nav-links');
    const isOpen = $nl.hasClass('mobile-open');

    if (isOpen) {
      $nl.removeClass('mobile-open').removeAttr('style');
      $(this).attr('aria-expanded', 'false');
    } else {
      $nl.addClass('mobile-open').css({
        display:    'flex',
        flexDirection: 'column',
        position:   'fixed',
        top:        '72px',
        left:       '0',
        right:      '0',
        background: 'var(--clr-surface)',
        padding:    '20px',
        boxShadow:  'var(--shadow-lg)',
        zIndex:     '999'
      });
      $(this).attr('aria-expanded', 'true');
    }
  });


  /* ─── 3. NEWSLETTER (todas las páginas) ──
     Feedback visual al suscribirse
  ─────────────────────────────────────────── */
  $('#newsletterForm').on('submit', function (e) {
    e.preventDefault();
    const $btn = $(this).find('button');
    $btn.text('✅ ¡Suscrito!').prop('disabled', true);
    setTimeout(() => {
      $btn.text('Suscribirme ✈️').prop('disabled', false);
      this.reset();
    }, 3000);
  });


  /* ─── 4. CONTADOR ANIMADO (index.html) ───
     Anima los números del section estadísticas
     usando IntersectionObserver + jQuery animate
  ─────────────────────────────────────────── */
  if ($('.counter-number').length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const $el     = $(entry.target);
        const target  = parseInt($el.data('target')) || 0;
        const suffix  = $el.data('suffix') || '';

        $({ n: 0 }).animate({ n: target }, {
          duration: 1800,
          easing: 'swing',
          step: function () {
            $el.text(Math.floor(this.n) + suffix);
          },
          complete: function () {
            $el.text(target + suffix);
          }
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    $('.counter-number').each(function () { observer.observe(this); });
  }


  /* ─── 5. FILTRO DESTINOS con jQuery ──────
     .filter() .hide() .show() en destinos.html
     (complementa el filtro CSS-only existente)
  ─────────────────────────────────────────── */
  if ($('.masonry-grid').length) {

    // Botones de filtro jQuery (se crean si existen .filter-tab labels)
    $('.filter-tab').on('click', function () {
      // El CSS-only maneja la visibilidad; acá agregamos animación
      const filter = $(this).attr('for').replace('f-', '');

      const $items = $('.dest-card-item');

      if (filter === 'all') {
        $items.stop(true).show(300);
      } else {
        $items.hide(); // oculto todo
        $items
          .filter(function () {
            return $(this).data('cat') === filter;
          })
          .show(300);
      }

    });

    // Zoom hover en cards con jQuery
    $('.masonry-card').on('mouseenter', function () {
      $(this).find('.masonry-bg').stop(true).animate({ opacity: 0.85 }, 200);
    }).on('mouseleave', function () {
      $(this).find('.masonry-bg').stop(true).animate({ opacity: 1 }, 200);
    });
  }


  /* ─── 6. FLIP CARDS con jQuery toggle ────
     agencias.html: toggle clase .flipped en mobile/touch
  ─────────────────────────────────────────── */
  if ($('.flip-card').length) {
    // Soporte táctil: click activa el flip en dispositivos touch
    $('.flip-card').on('click', function () {
      const $inner = $(this).find('.flip-inner');
      $inner.toggleClass('flipped');
    });

    // Accesibilidad: Enter/Space también activan el flip
    $('.flip-card').on('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).find('.flip-inner').toggleClass('flipped');
      }
    });
  }

  // CSS para el flip activado por clase (complemento)
  $('<style>.flip-inner.flipped{transform:rotateY(180deg)}</style>').appendTo('head');


  /* ─── 7. RATING ESTRELLAS con jQuery ─────
     agencias.html: feedback visual al elegir rating
  ─────────────────────────────────────────── */
  if ($('.stars-wrap').length) {
    $('.star-radio').on('change', function () {
      const $wrap = $(this).closest('.stars-wrap');
      const val   = parseInt($(this).val()) || 0;
      $wrap.find('.star-label').each(function (i) {
        $(this).css('color', i < val ? 'var(--clr-gold)' : 'var(--clr-surface2)');
      });
      // Mini-toast de feedback
      const $card = $(this).closest('.flip-front');
      if ($card.find('.rating-toast').length === 0) {
        const $toast = $('<span class="rating-toast" style="display:block;font-size:0.7rem;color:var(--clr-accent2);margin-top:4px">¡Gracias por tu valoración!</span>');
        $card.append($toast);
        setTimeout(() => $toast.fadeOut(400, function(){ $(this).remove(); }), 2500);
      }
    });
  }


  /* ─── 8. FORMULARIO CONTACTO ─────────────
     Validación en tiempo real + spinner + modal
  ─────────────────────────────────────────── */
  if ($('#contactForm').length) {

    // Validación en tiempo real con .on('input')
    $('#contactForm').find('.form-input[required]').on('input', function () {
      const val = $(this).val().trim();
      const ok  = this.checkValidity() && val.length > 0;
      $(this)
        .toggleClass('is-valid',   ok)
        .toggleClass('is-invalid', !ok && val.length > 0);
    });

    // Sanitización básica de inputs
    $('#contactForm').find('input[type="text"], textarea').on('input', function () {
      const clean = $(this).val().replace(/<[^>]*>/g, '');  // strip HTML tags
      if (clean !== $(this).val()) $(this).val(clean);
    });

    // Submit con spinner
    $('#contactForm').on('submit', function (e) {
      e.preventDefault();
      if (!this.checkValidity()) { this.reportValidity(); return; }

      const $btn = $('#submitBtn');
      $btn.addClass('loading').find('.btn-text').text('Enviando…');
      $btn.prop('disabled', true);

      setTimeout(() => {
        $btn.removeClass('loading').find('.btn-text').text('Enviar Consulta ✈️');
        $btn.prop('disabled', false);
        this.reset();
        $('#successModal').addClass('open');
        $('#modalClose').trigger('focus');
      }, 2200);
    });

    // Cierre del modal
    $('#modalClose').on('click', () => $('#successModal').removeClass('open'));
    $('#successModal').on('click', function (e) {
      if (e.target === this) $(this).removeClass('open');
    });
    $(document).on('keydown', e => {
      if (e.key === 'Escape') $('#successModal').removeClass('open');
    });
  }


  /* ─── 9. TOOLTIPS con jQuery ─────────────
     precios.html: muestra tooltip al hover/focus
  ─────────────────────────────────────────── */
  if ($('.tooltip-wrap').length) {
    $('.tooltip-wrap').on('mouseenter focus', function () {
      $(this).find('.tooltip-text').stop(true).fadeIn(200);
    }).on('mouseleave blur', function () {
      $(this).find('.tooltip-text').stop(true).fadeOut(150);
    });
  }


  /* ─── 10. HOVER DINÁMICO tabla precios ───
     precios.html: resalta fila bajo cursor
  ─────────────────────────────────────────── */
  $('tbody tr').on('mouseenter', function () {
    $(this).css('background', 'rgba(200,98,42,0.07)');
  }).on('mouseleave', function () {
    $(this).css('background', '');
  });


  /* ─── 11. FILTRO BLOG con jQuery ─────────
     blog.html: filtro por categorías
  ─────────────────────────────────────────── */
  if ($('.newspaper-grid').length) {
    // Los filtros CSS-only ya funcionan; jQuery agrega animación de entrada
    $('.blog-tag').on('click', function () {
      $('.article-card').each(function (i) {
        if ($(this).css('display') !== 'none') {
          $(this).css({ opacity: 0, transform: 'translateY(16px)' })
                 .delay(i * 60)
                 .queue(function (next) {
                   $(this).css({ transition: 'all 0.4s ease', opacity: 1, transform: 'translateY(0)' });
                   next();
                 });
        }
      });
    });
  }


  /* ─── 12. SCROLL REVEAL animación ────────
     Aplica animación a elementos .reveal al hacer scroll
  ─────────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).addClass('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $('.reveal').each(function () { revealObs.observe(this); });

  $('<style>' +
    '.reveal { opacity:0; transform:translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }' +
    '.reveal.visible { opacity:1; transform:translateY(0); }' +
    '.reveal-delay-1.visible { transition-delay: 0.1s; }' +
    '.reveal-delay-2.visible { transition-delay: 0.2s; }' +
    '.reveal-delay-3.visible { transition-delay: 0.3s; }' +
    '</style>').appendTo('head');


  /* ─── 13. TEXTO ANIMADO HERO (index) ──────
     Efecto typewriter en el subtítulo del hero
  ─────────────────────────────────────────── */
  if ($('.hero-sub').length) {
    const textos = [
      'Más de 500 destinos cuidadosamente seleccionados para crear los recuerdos que mereces',
      'Planes personalizados. Guías expertos. Memorias para toda la vida.',
      'Desde la Patagonia hasta el Caribe. Tu aventura perfecta empieza aquí.'
    ];
    let idx = 0;

    function cambiarTexto() {
      $('.hero-sub').fadeOut(500, function () {
        idx = (idx + 1) % textos.length;
        $(this).text(textos[idx]).fadeIn(500);
      });
    }
    setInterval(cambiarTexto, 5000);
  }

}); // end document.ready
