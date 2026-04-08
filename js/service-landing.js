/* ===========================================
   CORE 360 AGENCY — Service Landing JS
=========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== Reutiliza header scroll y reveal de main.js ===== */
  /* (main.js se carga primero y registra estos handlers) */

  /* ===== FAQ ACCORDION ===== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Cierra todos
      faqItems.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.classList.remove('open');
      });
      // Abre el clickeado si estaba cerrado
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  /* ===== SMOOTH SCROLL para anchors internos ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
