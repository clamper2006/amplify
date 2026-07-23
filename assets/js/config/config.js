/**
 * config.js
 * -----------------------------------------------------------------------
 * Configuración global de AMPLIFY.
 * Toda información editable del sitio (contacto, redes, mensajes,
 * duraciones de animación) vive aquí. Ningún otro módulo debe declarar
 * estos valores de forma independiente.
 * -----------------------------------------------------------------------
 */

window.AMPLIFY_CONFIG = Object.freeze({
  company: {
    name: 'AMPLIFY',
    legalName: 'Amplify Software Studio',
    tagline: 'Diseño y desarrollo de software premium.',
    foundingYear: 2026,
  },

  contact: {
    email: 'hola@amplify.dev',
    whatsapp: {
      number: '584244303352',
      url: 'https://wa.me/584244303352',
      defaultMessage: 'Hola, me interesa desarrollar un proyecto con AMPLIFY.',
    },
  },

  socials: {
    // Se añadirán progresivamente. Ocultos hasta que existan cuentas reales.
    instagram: '',
    linkedin: '',
    github: '',
    behance: '',
    dribbble: '',
    x: '',
  },

  nav: [
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Testimonios', href: '#testimonios' },
  ],

  motion: {
    lenisEnabled: true,
    lenisDuration: 1.15,
    particleDensity: 46,
    particleMaxDensityMobile: 20,
    cursorEnabled: true,
    revealThreshold: 0.16,
  },

  theme: {
    storageKey: 'amplify-theme',
    default: 'system',
  },
});
