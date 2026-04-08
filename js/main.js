/* ===========================================
   CORE 360 AGENCY — Main JavaScript
=========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== HEADER SCROLL ===== */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  /* ===== MOBILE NAV ===== */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  // Crear overlay dinámico
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav__overlay';
  document.body.appendChild(navOverlay);

  function openNav() {
    navToggle.classList.add('open');
    navMenu.classList.add('open');
    navOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeNav() : openNav();
  });

  // Close on link click
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on overlay click
  navOverlay.addEventListener('click', closeNav);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      closeNav();
    }
  });

  /* ===== NAV DROPDOWN ===== */
  const dropdownItems = document.querySelectorAll('.nav__item--dropdown');

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav__link--dropdown');
    if (!trigger) return;

    // Mobile: click toggles dropdown (prevents navigation)
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isOpen = item.classList.contains('open');
        // Close all other dropdowns
        dropdownItems.forEach(d => d.classList.remove('open'));
        item.classList.toggle('open', !isOpen);
      }
    });
  });

  // Close dropdowns when clicking outside (desktop)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item--dropdown')) {
      dropdownItems.forEach(d => d.classList.remove('open'));
    }
  });

  // Close dropdowns when nav closes
  const originalCloseNav = closeNav;
  window.closeNav = function() {
    originalCloseNav();
    dropdownItems.forEach(d => d.classList.remove('open'));
  };

  /* ===== SCROLL TO TOP ===== */
  document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== REVEAL ON SCROLL (Intersection Observer) ===== */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ===== STAT COUNTER ANIMATION ===== */
  const counters = document.querySelectorAll('.stat-num[data-target]');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    const heroSection = document.querySelector('.hero__stats');
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();
        const update = (time) => {
          const elapsed = time - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else counter.textContent = target;
        };
        requestAnimationFrame(update);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters(); // run once on load in case already visible

  /* ===== PORTFOLIO FILTER ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.dataset.filter;
      portfolioCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = show ? 'block' : 'none';
          if (show) {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          }
        }, 150);
      });
    });
  });

  /* ===== SMOOTH ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  function setActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* ===== CONTACT FORM — EmailJS ===== */
  // ─────────────────────────────────────────────────────────────
  // CONFIGURACIÓN (3 pasos en emailjs.com):
  //  1. Crea cuenta en https://www.emailjs.com
  //  2. Add Email Service → conecta tu correo Gmail/Outlook
  //     y copia el Service ID aquí ↓
  //  3. Email Templates → crea plantilla con estas variables:
  //     {{nombre}}, {{empresa}}, {{email}},
  //     {{telefono}}, {{servicio}}, {{mensaje}}
  //     y copia el Template ID aquí ↓
  //  4. Account > API Keys → copia tu Public Key aquí ↓
  // ─────────────────────────────────────────────────────────────
  const EMAILJS_PUBLIC_KEY  = 'TU_PUBLIC_KEY';
  const EMAILJS_SERVICE_ID  = 'TU_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';
  // ─────────────────────────────────────────────────────────────

  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalHtml = btn.innerHTML;

      // Validar campos requeridos
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#FF4D6D';
          field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
        }
      });
      if (!valid) return;

      btn.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
        .then(() => {
          btn.innerHTML = '<span>¡Mensaje enviado!</span> <i class="fas fa-check"></i>';
          btn.style.background = '#00C5E8';
          form.reset();
          setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          btn.innerHTML = '<span>Error al enviar. Intenta de nuevo.</span>';
          btn.style.background = '#FF4D6D';
          setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        });
    });
  }

  /* ===== MARQUEE PAUSE ON HOVER ===== */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const strip = document.querySelector('.marquee-strip');
    strip.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
    strip.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
  }

});
