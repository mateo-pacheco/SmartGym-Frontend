# Reporte de rendimiento — SmartGym Frontend

Fecha: 2026-07-05. Medidas del build de producción (`npm run build`, Vite 5, minificado + gzip).

## Bundle

| Artefacto | Tamaño | Gzip |
|---|---|---|
| `index.js` (app + React + Router + React Bootstrap + GSAP) | 409.5 kB | **139.5 kB** |
| `index.css` (Bootstrap completo + capa SmartGym) | 248.5 kB | **36.4 kB** |
| Fuente Archivo Variable (latin, wdth) | 90.1 kB | woff2 ya comprimido |
| Fuente latin-ext / vietnamese | 86.2 / 34.5 kB | solo se descargan si el navegador las necesita (unicode-range) |
| `index.html` | 1.25 kB | 0.68 kB |

Build: ✓ en 3.4 s, 186 módulos.

## Decisiones que protegen el runtime

- **Solo `transform`/`opacity` animados**; el loop 3D actualiza 7 nodos por frame con strings de transform (sin layout/paint) y **se pausa fuera del viewport** (`ScrollTrigger.onToggle`).
- Una única sección pinned; reveals `once: true` (los triggers se matan tras disparar).
- `gsap.matchMedia`: en móvil no hay pin ni scrub; con `prefers-reduced-motion` no se crea ningún tween.
- Skeletons con silueta (sin spinners re-render); sombras moderadas; `backdrop-filter` solo en dos barras fijas.
- Fuente autoalojada con `font-display: swap` + fallback métrico → sin FOIT; theme aplicado pre-paint → sin flash.
- SVG para todo el arte (0 imágenes raster): LCP del hero es texto + SVG inline, sin peticiones extra.

## Riesgos y mejoras futuras (honestas)

1. **CSS de Bootstrap completo (248 kB raw)**: se importa `bootstrap/scss/bootstrap` entero. Mejora: importar solo los parciales usados (reboot, grid, forms, offcanvas, modal, toasts) — estimación ~40–50% menos CSS raw. No se hizo aún para no arriesgar regresiones visuales al final de la fase.
2. **JS único de 139 kB gzip**: aceptable para SPA; si crece, dividir `/inicio` (GSAP + arte) con `React.lazy` y fallback local. GSAP core+ScrollTrigger ≈ 30 kB gzip del total.
3. **Sin medición Lighthouse en esta sesión** (entorno de preview sin la herramienta): pendiente de ejecutar en CI o local; objetivos: LCP <2.5 s, CLS <0.1, INP <200 ms. Por construcción no hay causas conocidas de CLS (dimensiones explícitas, swap métrico).
4. Al integrar datos reales: abortar requests obsoletos y paginar tablas largas (regla ya documentada).
