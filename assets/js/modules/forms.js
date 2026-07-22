/**
 * forms.js
 * -----------------------------------------------------------------------
 * Validación del formulario de contacto y construcción de enlaces de
 * WhatsApp a partir de la configuración global. El formulario no tiene
 * backend todavía: está completamente preparado (validación, estados,
 * mensajes) para conectarse a un endpoint real sin rediseñar nada.
 * -----------------------------------------------------------------------
 */

window.AmplifyForms = (function () {
  'use strict';

  const { qs, qsa } = window.AmplifyUtils;

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function buildWhatsappUrl(customMessage) {
    const { url, defaultMessage } = window.AMPLIFY_CONFIG.contact.whatsapp;
    const message = customMessage || defaultMessage;
    return `${url}?text=${encodeURIComponent(message)}`;
  }

  function hydrateWhatsappLinks() {
    qsa('[data-whatsapp-link]').forEach((link) => {
      link.setAttribute('href', buildWhatsappUrl());
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  function setFieldError(field, message) {
    field.classList.toggle('has-error', Boolean(message));
    const msgEl = field.querySelector('.field__message');
    if (msgEl) msgEl.textContent = message || '';
  }

  function validateField(field) {
    const input = field.querySelector('input, textarea');
    if (!input) return true;

    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');

    if (isRequired && !value) {
      setFieldError(field, 'Este campo es necesario.');
      return false;
    }

    if (input.type === 'email' && value && !EMAIL_PATTERN.test(value)) {
      setFieldError(field, 'Escribe un correo válido.');
      return false;
    }

    if (input.tagName === 'TEXTAREA' && value && value.length < 12) {
      setFieldError(field, 'Cuéntanos un poco más sobre tu proyecto.');
      return false;
    }

    setFieldError(field, '');
    return true;
  }

  function showStatus(statusEl, isSuccess, message) {
    statusEl.textContent = '';
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = isSuccess
      ? '<path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A2 2 0 003.82 21h16.36a2 2 0 001.71-3l-8.18-14.14a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    icon.style.width = '18px';
    icon.style.height = '18px';

    const text = document.createElement('span');
    text.textContent = message;

    statusEl.appendChild(icon);
    statusEl.appendChild(text);
    statusEl.classList.remove('form-status--success', 'form-status--error');
    statusEl.classList.add('is-visible', isSuccess ? 'form-status--success' : 'form-status--error');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = qsa('.field', form);
    const statusEl = qs('[data-form-status]', form);
    const submitBtn = qs('button[type="submit"]', form);

    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      if (statusEl) showStatus(statusEl, false, 'Revisa los campos marcados antes de continuar.');
      return;
    }

    if (submitBtn) {
      submitBtn.setAttribute('aria-disabled', 'true');
      submitBtn.dataset.originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Enviando…';
    }

    // No existe backend todavía: esta es la integración prevista.
    // Sustituir por un fetch() real hacia el endpoint del formulario.
    window.setTimeout(() => {
      if (submitBtn) {
        submitBtn.removeAttribute('aria-disabled');
        submitBtn.textContent = submitBtn.dataset.originalLabel;
      }
      if (statusEl) {
        showStatus(statusEl, true, 'Mensaje recibido. Te responderemos muy pronto.');
      }
      form.reset();
      fields.forEach((field) => setFieldError(field, ''));
    }, 900);
  }

  function initValidationOnBlur(form) {
    qsa('.field', form).forEach((field) => {
      const input = field.querySelector('input, textarea');
      if (!input) return;
      input.addEventListener('blur', () => validateField(field));
      input.addEventListener('input', () => {
        if (field.classList.contains('has-error')) validateField(field);
      });
    });
  }

  function init() {
    hydrateWhatsappLinks();

    const form = qs('[data-contact-form]');
    if (!form) return;

    initValidationOnBlur(form);
    form.addEventListener('submit', handleSubmit);
  }

  return { init, buildWhatsappUrl };
})();
