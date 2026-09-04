/**
 * portfolio.js
 * -----------------------------------------------------------------------
 * Carga proyectos desde assets/data/projects.json. Mientras el arreglo
 * "items" esté vacío (estado actual), el HTML ya publicado con el
 * estado vacío permanece intacto: no depende de JavaScript para verse
 * correctamente. En cuanto existan proyectos reales, este módulo
 * construirá el grid automáticamente sin tocar la arquitectura.
 * -----------------------------------------------------------------------
 */

window.AmplifyPortfolio = (function () {
  'use strict';

  function escapeAttr(value) {
    return String(value).replace(/"/g, '&quot;');
  }

  // Los custom properties de CSS (var(--foo)) resuelven las rutas
  // relativas dentro de un url() según la ubicación de la HOJA DE ESTILOS
  // que consume la variable (_cards.css), no según la del documento HTML.
  // Para evitar 404 por eso, convertimos la ruta a una URL absoluta antes
  // de inyectarla como variable CSS.
  function resolveUrl(path) {
    if (!path) return '';
    try {
      return new URL(path, document.baseURI).href;
    } catch (err) {
      return path;
    }
  }

  // Proyecto con un único enlace: la tarjeta entera sigue siendo un <a>.
  function singleLinkCard(project, image, link, hasLink) {
    const resolvedImage = resolveUrl(image);
    const bgStyle = resolvedImage ? ` style="--work-card-bg: url('${escapeAttr(resolvedImage)}')"` : '';

    return `
      <a
        class="card work-card"
        href="${escapeAttr(link)}"
        ${hasLink ? 'target="_blank" rel="noopener noreferrer"' : 'aria-disabled="true" tabindex="-1"'}
        data-reveal
        ${bgStyle}
      >
        <div class="work-card__meta badge">${project.category || project.industry || ''}</div>
        <h3>${project.name}</h3>
        <p class="text-secondary">${project.description || ''}</p>
      </a>
    `;
  }

  // Proyecto con varios enlaces (ej. tienda + panel admin): fondo dividido
  // 50/50 con una imagen por acceso, y un botón independiente por cada uno.
  function duoLinkCard(project, images, links) {
    const imageA = resolveUrl(images[0] || '');
    const imageB = resolveUrl(images[1] || images[0] || '');
    const bgStyle = ` style="--work-card-bg-a: url('${escapeAttr(imageA)}'); --work-card-bg-b: url('${escapeAttr(imageB)}');"`;

    const linksHtml = links
      .map((link, index) => {
        const slot = index === 0 ? 'a' : 'b';
        return `
          <a
            class="work-card__link"
            data-work-slot="${slot}"
            href="${escapeAttr(link.url || '#')}"
            target="_blank"
            rel="noopener noreferrer"
          >${escapeAttr(link.label || 'Ver proyecto')}</a>
        `;
      })
      .join('');

    return `
      <article class="card work-card work-card--duo" data-reveal${bgStyle}>
        <div class="work-card__meta badge">${project.category || project.industry || ''}</div>
        <h3>${project.name}</h3>
        <p class="text-secondary">${project.description || ''}</p>
        <div class="work-card__links">${linksHtml}</div>
      </article>
    `;
  }

  function cardTemplate(project) {
    // Soporta tanto el esquema actual de projects.json (coverImage / url)
    // como nombres alternativos (image / link), por si el JSON evoluciona.
    const images = Array.isArray(project.images) && project.images.length
      ? project.images
      : [project.image || project.coverImage || ''];
    const links = Array.isArray(project.links)
      ? project.links.filter((link) => link && link.url)
      : [];

    if (links.length > 1) {
      return duoLinkCard(project, images, links);
    }

    const image = images[0] || '';
    const link = (links[0] && links[0].url) || project.link || project.url || '#';
    const hasLink = Boolean((links[0] && links[0].url) || project.link || project.url);
    return singleLinkCard(project, image, link, hasLink);
  }

  async function init() {
    const grid = document.querySelector('[data-work-grid]');
    if (!grid) return;

    try {
      const response = await fetch('assets/data/projects.json', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];
      if (!items.length) return; // el estado vacío del HTML ya es correcto

      grid.innerHTML = items.map(cardTemplate).join('');
      const emptyState = document.querySelector('[data-work-empty]');
      if (emptyState) emptyState.remove();

      if (window.AmplifyReveal) window.AmplifyReveal.init();
    } catch (err) {
      // Sin conexión al archivo (p. ej. abierto vía file://): el estado
      // vacío servido en el HTML original sigue siendo perfectamente válido.
    }
  }

  return { init };
})();
