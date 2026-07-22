/**
 * testimonials.js
 * -----------------------------------------------------------------------
 * Misma filosofía que portfolio.js: carga testimonios reales cuando
 * existan en assets/data/testimonials.json. Hasta entonces, el estado
 * vacío ya presente en el HTML es la verdad servida al usuario.
 * -----------------------------------------------------------------------
 */

window.AmplifyTestimonials = (function () {
  'use strict';

  function cardTemplate(item) {
    return `
      <article class="card testimonial-card" data-reveal>
        <p class="testimonial-card__quote">“${item.quote}”</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar" role="img" aria-label="${item.name}"></div>
          <div>
            <strong>${item.name}</strong>
            <span>${item.role || ''}${item.company ? ' · ' + item.company : ''}</span>
          </div>
        </div>
      </article>
    `;
  }

  async function init() {
    const track = document.querySelector('[data-testimonials-track]');
    if (!track) return;

    try {
      const response = await fetch('assets/data/testimonials.json', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];
      if (!items.length) return;

      track.innerHTML = items.map(cardTemplate).join('');
      const emptyState = document.querySelector('[data-testimonials-empty]');
      if (emptyState) emptyState.remove();

      if (window.AmplifyReveal) window.AmplifyReveal.init();
    } catch (err) {
      // Estado vacío servido en el HTML original: comportamiento correcto.
    }
  }

  return { init };
})();
