/**
 * hero.js
 * -----------------------------------------------------------------------
 * Orquesta el Hero: aplica el retraso escalonado a cada línea del
 * titular y controla el glow ambiental que sigue al cursor dentro de
 * la primera pantalla. La secuencia de entrada completa (fondo →
 * partículas → isotipo → título → subtítulo → botones) se resuelve
 * combinando este módulo con las transiciones ya definidas en CSS.
 * -----------------------------------------------------------------------
 */

window.AmplifyHero = (function () {
  'use strict';

  const { qs, qsa, lerp, prefersReducedMotion, isTouchDevice } = window.AmplifyUtils;

  function setLineDelays() {
    const lines = qsa('.hero__title .line > span');
    lines.forEach((line, index) => {
      line.style.setProperty('--line-delay', `${260 + index * 130}ms`);
    });
  }

  function initAmbientGlow() {
    if (isTouchDevice() || prefersReducedMotion()) return;

    const hero = qs('.hero');
    const glow = qs('.ambient-glow');
    if (!hero || !glow) return;

    let targetX = hero.clientWidth / 2;
    let targetY = hero.clientHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = null;

    hero.addEventListener('mousemove', (event) => {
      const rect = hero.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
    }, { passive: true });

    function animate() {
      currentX = lerp(currentX, targetX, 0.06);
      currentY = lerp(currentY, targetY, 0.06);
      glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      rafId = window.requestAnimationFrame(animate);
    }

    rafId = window.requestAnimationFrame(animate);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && !rafId) {
        rafId = window.requestAnimationFrame(animate);
      }
    });
  }

  function init() {
    setLineDelays();
    initAmbientGlow();
  }

  return { init };
})();
