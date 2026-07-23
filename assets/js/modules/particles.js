/**
 * particles.js
 * -----------------------------------------------------------------------
 * Sistema de partículas ambientales para el Hero. Flotan lentamente,
 * cambian de dirección de forma orgánica y se apartan levemente del
 * cursor. Nunca invaden el contenido ni se convierten en protagonistas.
 * -----------------------------------------------------------------------
 */

window.AmplifyParticles = (function () {
  'use strict';

  const { clamp, prefersReducedMotion, isTouchDevice } = window.AmplifyUtils;

  let canvas, ctx, particles = [];
  let width, height, dpr;
  let rafId = null;
  let pointer = { x: null, y: null };
  let running = false;

  function accentColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '59, 240, 135';
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    const density = isTouchDevice()
      ? window.AMPLIFY_CONFIG.motion.particleMaxDensityMobile
      : window.AMPLIFY_CONFIG.motion.particleDensity;

    particles = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.6,
      baseAlpha: Math.random() * 0.35 + 0.15,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      driftSeed: Math.random() * 1000,
    }));
  }

  function step(time) {
    ctx.clearRect(0, 0, width, height);
    const rgb = accentColor();

    particles.forEach((p) => {
      // deriva orgánica muy sutil
      p.x += p.vx + Math.sin((time * 0.00008) + p.driftSeed) * 0.04;
      p.y += p.vy + Math.cos((time * 0.00008) + p.driftSeed) * 0.04;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      let px = p.x;
      let py = p.y;

      if (pointer.x !== null) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 140;
        if (dist < radius) {
          const force = (radius - dist) / radius;
          px += (dx / (dist || 1)) * force * 18;
          py += (dy / (dist || 1)) * force * 18;
        }
      }

      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${p.baseAlpha})`;
      ctx.fill();
    });

    rafId = window.requestAnimationFrame(step);
  }

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  }

  function onPointerLeave() {
    pointer.x = null;
    pointer.y = null;
  }

  function onVisibilityChange() {
    if (document.hidden) {
      pause();
    } else if (running) {
      resume();
    }
  }

  function pause() {
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = null;
  }

  function resume() {
    if (!rafId) rafId = window.requestAnimationFrame(step);
  }

  function init(selector) {
    canvas = document.querySelector(selector);
    if (!canvas || prefersReducedMotion()) return;

    ctx = canvas.getContext('2d');
    running = true;

    resize();
    createParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    }, { passive: true });

    canvas.parentElement.addEventListener('mousemove', onPointerMove, { passive: true });
    canvas.parentElement.addEventListener('mouseleave', onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    rafId = window.requestAnimationFrame(step);
  }

  return { init, pause, resume };
})();
