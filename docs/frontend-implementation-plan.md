# Plan de implementación — SmartGym Frontend

Fecha: 2026-07-05. Plan ejecutado en fases pequeñas verificadas (lint/typecheck/tests/build tras cada fase significativa).

## Fases

1. **Descubrimiento y gobernanza**: lectura completa de `AGENTS.md` y `CLAUDE.md`; `find-skills` real; instalación/carga de skills; `PRODUCT.md` y `DESIGN.md` (setup de la skill impeccable).
2. **Scaffold del stack estricto**: Vite + React 18 + TypeScript, React Router 6 (data router), Bootstrap 5.3 + React Bootstrap 2.10, SCSS propio, GSAP 3.12, Archivo Variable autoalojada. ESLint + Vitest + Testing Library.
3. **Capa de diseño**: `src/design/tokens.css` (paleta UCACUE provisional + geometría + motion), `themes.css` (claro/oscuro semánticos separados), `bootstrap.scss` (Bootstrap con identidad), `motion.css` (transición de ruta, reduced motion), `app.scss` (shell + primitivas).
4. **Marca**: `smartgym-mark.svg`, `smartgym-lockup.svg`, `favicon.svg` originales (escudo + onda NFC + aro de manilla).
5. **Shell persistente**: `AppShell` con `SideNav` (256px), `TopBar`, `MobileNav` (Offcanvas), `SkipToContent`; outlet anidado con transición ≤180 ms; key solo en el contenido.
6. **Primitivas compartidas**: `AppButton`, `StatusBadge`, `DataTable`, `TableSkeleton`, `EmptyState`/`NoContractState`/`ErrorState`/`PermissionDeniedState`, `PageHeader` + `Breadcrumbs`, `FilterBar` + `SearchField`, `MetricInline`, set de iconos SVG local, ilustraciones de estados vacíos.
7. **Rutas operativas** (11) bajo el shell + `/inicio` editorial + 404: ver `frontend-delivery-report.md`.
8. **Home editorial `/inicio`**: hero asimétrico con arte SVG por capas, loop pseudo-3D (única sección pinned), módulos alternados + índice, consola operativa honesta, seguridad, cierre crimson, footer sobrio.
9. **Validación**: lint, typecheck, tests, build; verificación en navegador real (1280/390/360, claro/oscuro, navegación sin remount, pin del loop, overflow); auditoría visual documentada.
10. **Documentación**: los 11 documentos requeridos por AGENTS.md §21.

## Dependencias de endpoints

No existe ningún contrato confirmado. `src/services/api/client.ts` centraliza la detección (`VITE_SMARTGYM_API_URL`); cada módulo declara "sin contrato" y lista qué mostrará cuando exista. **Ningún endpoint fue inventado.**

## Riesgos identificados

- Contratos de backend desconocidos → las tablas definen columnas plausibles de producto que deberán ajustarse al contrato real (solo estructura visual, no datos).
- Paleta provisional → si UCACUE entrega manual oficial, actualizar `tokens.css` y documentar en `frontend-design-decisions.md`.
- Fotografía editorial pendiente de licencias verificables → slots declarados en `frontend-assets-manifest.md`; el arte actual es SVG original.

## Puertas de calidad

Lint sin warnings (`--max-warnings 0`), `tsc -b` estricto, Vitest, build de producción, verificación responsive/tema/navegación en navegador, y el checklist final de AGENTS.md §22.
