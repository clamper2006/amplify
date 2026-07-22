/**
 * portfolio.js
 * -----------------------------------------------------------------------
 * Carga proyectos desde assets/data/projects.json. Mientras el arreglo
 * "items" esté vacío (estado actual), el HTML ya publicado con el
 * estado vacío permanece intacto: no depende de JavaScript para verse
 * correctamente. En cuanto existan proyectos reales, este módulo
 * construirá el grid automáticamente sin tocar la arquitectura.
 * -----------------------------------------------------------------------
 */

window.AmplifyPortfolio = (function () {
  'use strict';

  function cardTemplate(project) {
    return `
      <article class="card work-card" data-reveal>
        <div class="work-card__meta badge">${project.category || project.industry || ''}</div>
        <h3>${project.name}</h3>
        <p class="text-secondary">${project.description || ''}</p>
      </article>
    `;
  }

  async function init() {
    const grid = document.querySelector('[data-work-grid]');
    if (!grid) return;

    try {
      const response = await fetch('assets/data/projects.json', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];
      if (!items.length) return; // el estado vacío del HTML ya es correcto

      grid.innerHTML = items.map(cardTemplate).join('');
      const emptyState = document.querySelector('[data-work-empty]');
      if (emptyState) emptyState.remove();

      if (window.AmplifyReveal) window.AmplifyReveal.init();
    } catch (err) {
      // Sin conexión al archivo (p. ej. abierto vía file://): el estado
      // vacío servido en el HTML original sigue siendo perfectamente válido.
    }
  }

  return { init };
})();
