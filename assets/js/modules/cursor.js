/**
 * cursor.js
 * -----------------------------------------------------------------------
 * Cursor personalizado. El punto sigue al puntero con precisión; el
 * anillo lo persigue con una leve inercia (lerp) para transmitir peso.
 * Se desactiva completamente en dispositivos táctiles.
 * -----------------------------------------------------------------------
 */

window.AmplifyCursor = (function () {
  'use strict';

  const { qs, qsa, lerp, isTouchDevice, prefersReducedMotion } = window.AmplifyUtils;

  let dot, ring;
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let rafId = null;

  function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }

  function tick() {
    ringX = lerp(ringX, mouseX, 0.16);
    ringY = lerp(ringY, mouseY, 0.16);
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    rafId = window.requestAnimationFrame(tick);
  }

  function bindHoverTargets() {
    const targets = qsa('a, button, [data-cursor-hover]');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', () => document.documentElement.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.documentElement.classList.remove('cursor-hover'));
    });
  }

  function init() {
    if (isTouchDevice() || prefersReducedMotion()) return;
    if (!window.AMPLIFY_CONFIG.motion.cursorEnabled) return;

    dot = qs('.cursor-dot');
    ring = qs('.cursor-ring');
    if (!dot || !ring) return;

    document.documentElement.classList.add('cursor-ready');
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    bindHoverTargets();
    rafId = window.requestAnimationFrame(tick);
  }

  function destroy() {
    if (rafId) window.cancelAnimationFrame(rafId);
  }

  return { init, destroy };
})();
