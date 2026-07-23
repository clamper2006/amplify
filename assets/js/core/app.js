/**
 * app.js
 * -----------------------------------------------------------------------
 * Punto de entrada único. Inicializa cada módulo en el orden correcto y
 * protege el arranque con comprobaciones de existencia: si un módulo no
 * está presente (por ejemplo, Lenis no cargó por falta de red), el resto
 * de la aplicación sigue funcionando con normalidad.
 * -----------------------------------------------------------------------
 */

(function bootstrap() {
  'use strict';

  function safeInit(moduleRef, name) {
    try {
      if (moduleRef && typeof moduleRef.init === 'function') {
        moduleRef.init();
      }
    } catch (err) {
      console.error(`[AMPLIFY] Falló la inicialización del módulo "${name}":`, err);
    }
  }

  function initEarly() {
    // El tema debe resolverse antes del primer pintado para evitar parpadeos.
    safeInit(window.AmplifyTheme, 'theme');
  }

  function initApp() {
    safeInit(window.AmplifyLoader, 'loader');
    safeInit(window.AmplifyNavbar, 'navbar');
    safeInit(window.AmplifyScroll, 'scroll');
    safeInit(window.AmplifyReveal, 'reveal');
    safeInit(window.AmplifyCursor, 'cursor');
    safeInit(window.AmplifyHero, 'hero');
    safeInit(window.AmplifyForms, 'forms');
    safeInit(window.AmplifyFooter, 'footer');
    safeInit(window.AmplifyPortfolio, 'portfolio');
    safeInit(window.AmplifyTestimonials, 'testimonials');

    if (window.AmplifyParticles) {
      window.AmplifyParticles.init('[data-particles-canvas]');
    }
  }

  initEarly();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
