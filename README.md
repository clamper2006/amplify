# AMPLIFY — Sitio web oficial

Sitio institucional del estudio de diseño y desarrollo de software AMPLIFY.
Construido como HTML/CSS/JS nativo, sin frameworks ni paso de compilación,
con una arquitectura pensada para escalar durante años.

---

## 1. Instalación y ejecución

No requiere `npm install`. Es HTML/CSS/JS puro.

**Importante:** abre el sitio a través de un servidor local, no con doble
clic sobre `index.html`. Los módulos de Portafolio y Testimonios cargan
datos vía `fetch()` desde `assets/data/*.json`, y los navegadores basados
en Chromium bloquean esas peticiones bajo el protocolo `file://`. El resto
del sitio funciona igual sin servidor, pero para ver la experiencia completa:

```bash
# Opción 1 — extensión "Live Server" de VS Code
# clic derecho sobre index.html → "Open with Live Server"

# Opción 2 — Node
npx serve .

# Opción 3 — Python
python3 -m http.server 5500
```

Luego abre `http://localhost:5500` (o el puerto que indique tu servidor).

---

## 2. Estructura del proyecto

```
AMPLIFY/
├── index.html              Página principal
├── 404.html                 Página de error, coherente con la identidad
├── robots.txt
├── sitemap.xml
├── manifest.webmanifest     Preparado para evolucionar a PWA
├── favicon/                 Set completo de íconos (SVG + PNG)
└── assets/
    ├── css/
    │   ├── base/             Variables (design tokens), reset, tipografía
    │   ├── layout/           Navbar, footer, grid
    │   ├── components/       Botones, cards, inputs, modal, cursor, loader
    │   ├── utilities/        Clases utilitarias mínimas
    │   ├── themes/           Ajustes finos de tema claro / oscuro
    │   └── pages/            Composición específica de cada página
    ├── js/
    │   ├── config/           Configuración global (única fuente de verdad)
    │   ├── core/             Bootstrap de la aplicación
    │   ├── utils/             Helpers reutilizables (DOM, throttle, lerp…)
    │   └── modules/          Un archivo = una responsabilidad
    ├── data/                 JSON de proyectos, testimonios, servicios…
    ├── logos/                Assets de marca originales
    ├── svg/                  Isotipo vectorizado reutilizable
    ├── icons/                Set de iconos de interfaz, mismo lenguaje visual
    └── images/               Imagen de Open Graph y demás recursos visuales
```

Cada carpeta tiene una única responsabilidad. Ningún archivo mezcla lógica
de distintos módulos, y no existen dependencias circulares entre ellos.

---

## 3. Arquitectura del CSS

El sistema visual completo depende de **design tokens** definidos en
`assets/css/base/_variables.css`: color, tipografía, espaciado, radios,
sombras, duraciones y curvas de animación. Ningún componente declara un
valor "suelto" — todo se deriva de esas variables.

El tema claro/oscuro es un simple cambio de `data-theme` en `<html>`: los
componentes solo consumen variables (`var(--text-primary)`, etc.), nunca
colores directos, así que añadir un tercer tema en el futuro no requiere
tocar un solo componente.

Los archivos CSS se cargan como `<link>` independientes (no mediante
`@import` encadenado) para aprovechar la carga paralela del navegador y
evitar el coste de rendimiento de las cadenas de `@import`.

---

## 4. Arquitectura del JavaScript

Cada módulo en `assets/js/modules/` resuelve una única responsabilidad:

| Módulo | Responsabilidad |
|---|---|
| `theme.js` | Tema claro/oscuro, persistencia en `localStorage`, `prefers-color-scheme` |
| `navbar.js` | Estado *scrolled* del navbar, menú móvil |
| `scroll.js` | Integración de Lenis (scroll inercial) e indicador de progreso |
| `reveal.js` | Revelado progresivo con `IntersectionObserver` |
| `cursor.js` | Cursor personalizado con inercia (`lerp`) |
| `particles.js` | Sistema de partículas ambientales en canvas |
| `hero.js` | Orquestación de la entrada cinematográfica del Hero |
| `forms.js` | Validación del formulario y construcción de enlaces de WhatsApp |
| `portfolio.js` / `testimonials.js` | Carga progresiva de datos reales cuando existan |
| `footer.js` | Año dinámico y enlaces sociales condicionales |

`assets/js/core/app.js` es el único punto de entrada: inicializa cada
módulo dentro de un `try/catch` individual, de modo que si uno falla
(por ejemplo, Lenis no cargó por falta de red) el resto del sitio sigue
funcionando con normalidad.

---

## 5. Configuración global

Toda la información editable del sitio vive en **un único archivo**:

```
assets/js/config/config.js
```

Ahí se edita el número de WhatsApp, el mensaje inicial, el correo, los
enlaces de navegación y los parámetros de animación. Ningún otro archivo
debe declarar estos valores por su cuenta.

Para cambiar el mensaje predeterminado de WhatsApp, por ejemplo:

```js
contact: {
  whatsapp: {
    number: '584244303352',
    defaultMessage: 'Tu nuevo mensaje aquí',
  }
}
```

---

## 6. Contenido preparado, no inventado

Siguiendo el criterio del proyecto, las secciones de **Proyectos** y
**Testimonios** se entregan intencionalmente vacías: no contienen datos
ficticios. La arquitectura ya está lista para mostrarlos en cuanto
existan — solo hay que añadir los objetos correspondientes a:

```
assets/data/projects.json
assets/data/testimonials.json
```

En cuanto el arreglo `items` deje de estar vacío, `portfolio.js` y
`testimonials.js` reemplazan automáticamente el estado vacío por las
tarjetas reales, sin tocar el HTML ni el CSS.

`assets/data/stats.json` y `assets/data/faq.json` siguen la misma lógica
para las futuras secciones de estadísticas y preguntas frecuentes, que
aún no se muestran en el sitio.

---

## 7. Identidad visual

- **Color de acento:** `#3BF087`, extraído directamente del isotipo real de la marca.
- **Escala neutra:** derivada de los grises de marca (`#333333` claro / `#E6E6E6` oscuro).
- **Tipografía:** Space Grotesk (display) + Inter (cuerpo) + JetBrains Mono (detalles técnicos).
- **Isotipo:** vectorizado a partir del PNG original, no redibujado a mano — se anima en el Hero, el loader, el 404 y el indicador de progreso de scroll.

---

## 8. Rendimiento y accesibilidad

- Animaciones basadas en `transform`/`opacity`, nunca en propiedades que disparan *layout*.
- `IntersectionObserver` para el *reveal* en scroll — sin listeners de scroll costosos.
- Reproducción de partículas y cursor personalizado deshabilitadas automáticamente en `prefers-reduced-motion: reduce` y en dispositivos táctiles.
- Todo el sitio es navegable por teclado, con `:focus-visible` consistente.
- Jerarquía semántica correcta (`header`, `main`, `section`, `footer`, encabezados en orden).

---

## 9. Próximos pasos sugeridos

- Conectar `contact__form` a un endpoint real (`forms.js` ya está preparado para sustituir el `setTimeout` simulado por un `fetch()`).
- Añadir proyectos y testimonios reales a los JSON correspondientes.
- Sustituir `https://amplify.dev` por el dominio definitivo en `index.html`, `404.html`, `robots.txt` y `sitemap.xml`.
- Completar `assets/js/config/config.js` con las redes sociales reales en cuanto existan.
