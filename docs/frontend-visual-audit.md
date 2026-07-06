# Auditoría visual — SmartGym Frontend

Fecha: 2026-07-05. Método: navegador Chromium real contra el dev server (`npm run dev`), con redimensionado de viewport, navegación real e inspección DOM. Los hallazgos con ✗→✓ fueron corregidos en esta misma entrega.

## Verificaciones realizadas

| Chequeo | Resultado |
|---|---|
| 1280×800 (desktop) | ✓ Hero 2 columnas (499/599 px), display 67 px tras corrección, sin overflow-x |
| 390×844 (móvil) | ✓ Offcanvas de navegación funcional, hero apilado, loop sin pin, sin overflow-x |
| 360×740 (móvil pequeño) | ✓ Sin overflow-x |
| Tema claro | ✓ Canvas cálido, jerarquía correcta (capturas de hero, loop, módulos, consola, seguridad) |
| Tema oscuro | ✓ Verificado en `/inicio` y en el shell (`/operacion/accesos`): carbón cálido, badges recalibrados, ilustraciones legibles |
| Navegación entre rutas | ✓ SPA pura; shell persistente verificado con marcador DOM (`shellPersisted: true`); transición de outlet ≤180 ms |
| Scroll del home | ✓ Arco completo: hero → loop pinned (pin-spacer único de 2880 px) → módulos → consola → seguridad → cierre → footer |
| Loop pseudo-3D | ✓ 7 nodos orbitando con perspectiva real (frontal mayor, traseros atenuados), anillo crimson dibujándose por scrub, captions por etapa, hub con marca |
| Estados vacíos | ✓ Todos los módulos: ilustración + título + explicación dentro del cuerpo de tabla |
| Consola de errores | ✓ Sin errores; los warnings de future-flags de React Router se eliminaron activando los flags v7 |
| Teclado | ✓ `SkipToContent` operativo, focus visible (outline 2px `--sg-focus`), offcanvas y controles nativos accesibles; labels asociados en todos los inputs (visually-hidden donde procede) |
| Etiquetas largas | ✓ `text-wrap: balance/pretty`, contexto del topbar con ellipsis, breadcrumbs con wrap |

## Hallazgos corregidos durante la auditoría

1. ✗→✓ **CTA del nav partido en dos líneas** en viewport angosto → etiqueta acortada a "Ingresar" (el hero conserva "Ingresar a la plataforma").
2. ✗→✓ **Hero desbordaba el viewport inicial** (display 94 px × 4 líneas dejaba los CTAs bajo el fold) → `clamp` reducido a máx 4.2rem; verificado: CTA bottom 679 px < 800 px.
3. ✗→✓ **Em-dashes (`—`) como placeholder de métricas** (tell tipográfico prohibido por la taste skill) → reemplazados por `N/D` en consola, panel y telemetría.
4. ✗→✓ **Franja lateral de color** en el ítem activo del SideNav (patrón vetado por impeccable) → eliminado; el activo usa tinte + color.

## Ronda 2 (misma fecha): revisión UX aplicada y verificada

Correcciones a partir de la revisión de usuario/QA, verificadas en navegador (1280 y 390 px):

1. ✗→✓ **Reveals que dejaban secciones vacías al scrollear rápido** → duración 0.45 s, umbral `top 92%`, `overwrite: auto`; verificado por DOM (`opacity: 1` tras disparo) y `elementFromPoint`.
2. ✗→✓ **Hero invisible hasta terminar la coreografía** → todas las intros ahora son `fromTo` + `clearProps` al completar; en móvil una sola pasada de 0.35 s; sin estados iniciales persistentes posibles.
3. ✗→✓ **Pin demasiado largo** → de `+=260%` a `+=160%` (spacer 2880→2080 px).
4. ✗→✓ **Solapamiento hub/chips del loop** → hub al 38%, órbita al 62%, radio 225; verificado: 46 px de separación.
5. ✗→✓ **Arte del hero al final en móvil** → `order:-1` con altura 148 px; CTAs dentro del primer viewport (bottom 844/844).
6. ✗→✓ **Targets <44 px** → regla global `@media (pointer:coarse), (max-width:767.98px)` para botones sm/icono, enlaces de nav e inputs.
7. ✗→✓ **Topbar apretado en móvil** → "Ver presentación" pasa a botón de icono con `aria-label` bajo `md`.
8. ✗→✓ **Selects/dates sin diseño** → chevron SVG propio por tema, foco con ring `--sg-focus`, alturas consistentes, estados inválidos.
9. ✗→✓ **Labels invisibles en filtros** → labels visibles (`.sg-field-label`) en Auditoría, Accesos y Deportistas.
10. ✗→✓ **Empty states poco útiles** → `NoContractState` ahora declara el contrato requerido y la acción que habilitará.
11. ✗→✓ **Enlaces "Abrir" genéricos** → "Abrir deportistas/planes/XR/reportes/privacidad".
12. ✗→✓ **Sin imágenes** → 3 fotografías verificadas (ver manifiesto) en campus/cierre/login; reveal por clip-path en la banda del campus.
13. ✓ **Nuevo**: página `/ingresar` (validación inline, aviso honesto de autenticación, entrada coreografiada), sección "Tres flujos críticos", fondo topográfico original + **parallax de cursor** (contornos, capas del arte y tilt de la escena 3D verificados con `pointermove` sintético), formularios modales de alta (manilla con stepper de 3 pasos, reserva, deportista) con borradores locales etiquetados y toasts.
14. ✓ Flujo completo verificado en navegador: stepper → validación → resumen → guardado → toast → fila "Borrador local" en la tabla.
15. Nota de entorno: el error "Invalid hook call" tras añadir `ToastContainer` fue caché de dependencias de Vite (dos copias de React en dev); se resolvió limpiando `node_modules/.vite`. No afecta al build.

## Limitaciones reales pendientes

- **`prefers-reduced-motion` verificado por código, no por emulación**: la vía reduced (composición estática, sin pin/órbita, CSS colapsado) está implementada vía `gsap.matchMedia` + media queries, pero el entorno de preview no permitió emular la preferencia. Pendiente una pasada manual con la preferencia del SO activada.
- **1440/1600 px no capturados**: el layout usa `max-width` contenedores (1280/1520/1560) + `clamp`, por lo que no hay diferencias estructurales esperables, pero falta la captura formal.
- **Carga lenta / imágenes lentas**: no hay imágenes raster que degradar; falta prueba con throttling de red para el JS inicial.
- Estados de **carga real y error de API** solo se activarán cuando exista contrato (hoy se muestra el estado "sin contrato" por diseño).
