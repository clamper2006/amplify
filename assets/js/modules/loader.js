/**
 * loader.js
 * -----------------------------------------------------------------------
 * Controla la pantalla de carga inicial. Se retira en cuanto la página
 * está lista, nunca antes de un mínimo perceptible (evita parpadeos) ni
 * después de lo necesario (evita esperas artificiales).
 * -----------------------------------------------------------------------
 */

window.AmplifyLoader = (function () {
  'use strict';

  const MIN_VISIBLE_MS = 420;

  function reveal() {
    document.documentElement.classList.add('is-loaded');
    window.dispatchEvent(new CustomEvent('amplify:loaded'));
  }

  function init() {
    const startedAt = performance.now();

    const finish = () => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(reveal, remaining);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    // Salvaguarda: nunca bloquear la experiencia más de 4s.
    window.setTimeout(() => {
      if (!document.documentElement.classList.contains('is-loaded')) reveal();
    }, 4000);
  }

  return { init };
})();
