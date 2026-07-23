/**
 * dom.js
 * -----------------------------------------------------------------------
 * Utilidades DOM pequeñas y reutilizables. Sin dependencias externas.
 * -----------------------------------------------------------------------
 */

window.AmplifyUtils = (function () {
  'use strict';

  /** Selector corto con contexto opcional. */
  function qs(selector, context) {
    return (context || document).querySelector(selector);
  }

  /** Selector múltiple devuelto como array real. */
  function qsa(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  /** Limita la frecuencia de ejecución de una función (scroll, resize). */
  function throttle(fn, wait) {
    let last = 0;
    let pendingId = null;
    return function throttled(...args) {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) {
        last = now;
        fn.apply(this, args);
      } else if (!pendingId) {
        pendingId = window.setTimeout(() => {
          last = Date.now();
          pendingId = null;
          fn.apply(this, args);
        }, remaining);
      }
    };
  }

  /** Pospone la ejecución hasta que cesen los eventos consecutivos. */
  function debounce(fn, wait) {
    let timeoutId;
    return function debounced(...args) {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /** Interpolación lineal — usada por el sistema de cursor y partículas. */
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isTouchDevice() {
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
  }

  return { qs, qsa, throttle, debounce, lerp, clamp, prefersReducedMotion, isTouchDevice };
})();
