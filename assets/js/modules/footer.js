/**
 * footer.js
 * -----------------------------------------------------------------------
 * Hidrata el año de copyright y construye los enlaces sociales
 * únicamente para las redes que ya tienen URL configurada. Mientras
 * config.socials esté vacío, no se renderiza ningún icono: preparado,
 * pero sin mostrar nada que todavía no existe (Capítulo 6).
 * -----------------------------------------------------------------------
 */

window.AmplifyFooter = (function () {
  'use strict';

  const ICONS = {
    instagram: '<path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM17.5 6.5h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M7 10v7M7 7v.01M11 17v-4.5c0-1.4 1-2.5 2.4-2.5s2.6 1.1 2.6 2.5V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    github: '<path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-1.99 1.03-2.69-.1-.26-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.6 9.6 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.66.64.7 1.03 1.59 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>',
    behance: '<path d="M3 7h6.5a2.5 2.5 0 010 5H3zM3 12h7a2.5 2.5 0 010 5H3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15 13.5a3.5 3.5 0 107 0c0-.3-.02-.5-.06-.8H15.3M15.3 12.5a3.2 3.2 0 016.1 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M15.5 8.5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    dribbble: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M4 9.5c4 1.4 9 1.6 15.5.3M3.5 15c5-2 10-2.2 15.8-.6M9 3.2c3 3.6 5 8.4 5.3 17.3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    x: '<path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  };

  function socialTemplate(key, url) {
    const path = ICONS[key];
    if (!path) return '';
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${key}"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${path}</svg></a>`;
  }

  function init() {
    const yearEl = document.querySelector('[data-current-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const container = document.querySelector('[data-social-links]');
    if (!container) return;

    const socials = window.AMPLIFY_CONFIG.socials || {};
    const markup = Object.keys(socials)
      .filter((key) => Boolean(socials[key]))
      .map((key) => socialTemplate(key, socials[key]))
      .join('');

    container.innerHTML = markup;
    container.hidden = markup.length === 0;
  }

  return { init };
})();
