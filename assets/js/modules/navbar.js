/**
 * navbar.js
 * -----------------------------------------------------------------------
 * Comportamiento del navbar: transición sutil a estado "scrolled" y
 * apertura/cierre del menú móvil. Sin lógica ajena a la navegación.
 * -----------------------------------------------------------------------
 */

window.AmplifyNavbar = (function () {
  'use strict';

  const { qs, qsa, throttle } = window.AmplifyUtils;
  let navbarEl = null;

  function handleScrollState() {
    const scrolled = window.scrollY > 24;
    navbarEl.classList.toggle('is-scrolled', scrolled);
  }

  function initMobileMenu() {
    const toggle = qs('[data-menu-toggle]');
    const links = qsa('.navbar__links a');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const isOpen = document.documentElement.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('u-no-scroll', isOpen);
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        document.documentElement.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('u-no-scroll');
      });
    });
  }

  function init() {
    navbarEl = qs('[data-navbar]');
    if (!navbarEl) return;

    handleScrollState();
    window.addEventListener('scroll', throttle(handleScrollState, 80), { passive: true });
    initMobileMenu();
  }

  return { init };
})();
