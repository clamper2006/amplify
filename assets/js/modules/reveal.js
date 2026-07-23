/**
 * reveal.js
 * -----------------------------------------------------------------------
 * Revela progresivamente los elementos marcados con [data-reveal] o
 * [data-reveal-group] a medida que entran en el viewport, mediante
 * IntersectionObserver (sin listeners de scroll costosos).
 * -----------------------------------------------------------------------
 */

window.AmplifyReveal = (function () {
  'use strict';

  const { qsa, prefersReducedMotion } = window.AmplifyUtils;

  function init() {
    const targets = qsa('[data-reveal], [data-reveal-group]');
    if (!targets.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const threshold = window.AMPLIFY_CONFIG.motion.revealThreshold;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  return { init };
})();
