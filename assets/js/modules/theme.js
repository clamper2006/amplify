/**
 * theme.js
 * -----------------------------------------------------------------------
 * Sistema de temas. Responsabilidad única: decidir y aplicar 'light' u
 * 'oscuro' sobre <html data-theme="">, persistir la preferencia del
 * usuario y respetar prefers-color-scheme cuando no exista preferencia.
 * -----------------------------------------------------------------------
 */

window.AmplifyTheme = (function () {
  'use strict';

  const config = window.AMPLIFY_CONFIG.theme;
  const root = document.documentElement;
  let toggleEl = null;
  let mediaQuery = null;

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(config.storageKey);
    } catch (err) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem(config.storageKey, theme);
    } catch (err) {
      /* almacenamiento no disponible — la sesión seguirá funcionando */
    }
  }

  function systemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', theme === 'dark' ? '#0a0a0c' : '#ffffff');
    if (toggleEl) {
      toggleEl.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  function resolveInitialTheme() {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function toggle() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    storeTheme(next);
  }

  function init() {
    apply(resolveInitialTheme());

    toggleEl = document.querySelector('[data-theme-toggle]');
    if (toggleEl) {
      toggleEl.addEventListener('click', toggle);
    }

    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (event) => {
      if (!getStoredTheme()) {
        apply(event.matches ? 'dark' : 'light');
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onSystemChange);
    }
  }

  return { init, toggle };
})();
