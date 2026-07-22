/**
 * scroll.js
 * -----------------------------------------------------------------------
 * Inicializa Lenis para un desplazamiento inercial y cinematográfico, y
 * mantiene actualizado el indicador visual de progreso de scroll.
 * Si Lenis no está disponible (p. ej. sin red) degrada con elegancia al
 * scroll nativo del navegador, sin romper el resto de módulos.
 * -----------------------------------------------------------------------
 */

window.AmplifyScroll = (function () {
  'use strict';

  const { qs, prefersReducedMotion } = window.AmplifyUtils;
  let lenis = null;
  let fillEl = null;

  function updateProgress() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || window.scrollY;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? clampPercent((scrollTop / scrollHeight) * 100) : 0;
    if (fillEl) fillEl.style.height = progress + '%';
  }

  function clampPercent(value) {
    return Math.min(100, Math.max(0, value));
  }

  function raf(time) {
    if (lenis) lenis.raf(time);
    updateProgress();
    window.requestAnimationFrame(raf);
  }

  function init() {
    fillEl = qs('[data-scroll-fill]');
    document.documentElement.classList.add('has-lenis');

    const reduced = prefersReducedMotion();
    const canUseLenis = window.Lenis && window.AMPLIFY_CONFIG.motion.lenisEnabled && !reduced;

    if (canUseLenis) {
      lenis = new window.Lenis({
        duration: window.AMPLIFY_CONFIG.motion.lenisDuration,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
      });
    } else {
      document.documentElement.classList.remove('has-lenis');
    }

    window.requestAnimationFrame(raf);

    // Enlaces internos: desplazamiento suave hacia anclas
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -24 });
      } else {
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }

  return { init, getInstance: () => lenis };
})();
