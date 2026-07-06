# DESIGN.md — SmartGym

Sistema visual del frontend SmartGym. Fuente de tokens: `AGENTS.md` §4 (paleta UCACUE **provisional**) → implementada en `src/design/tokens.css` y `src/design/themes.css`.

## Theme

- Dual: `[data-theme="light"]` (canvas cálido `#FBFAF8`, superficies limpias) y `[data-theme="dark"]` (carbón cálido `#151416`, burdeos profundo). Sistemas semánticos separados, no inversión automática. Sin negro puro ni blanco puro de canvas.
- Estrategia de color: **Restrained** en pantallas operativas (crimson ≤10%, solo CTA/selección/identidad); `/inicio` puede ser **Committed** por secciones (crimson como voz editorial).

## Color

| Rol | Light | Dark |
|---|---|---|
| Canvas | `#FBFAF8` | `#151416` |
| Surface | `#FFFFFF` | `#1D1B1E` |
| Surface raised | `#F5F3F0` | `#282427` |
| Border | `#E2DEDA` | `#3D383C` |
| Texto primario | `#1B1C1F` | `#F8F6F4` |
| Texto secundario | `#5E6067` | `#D1CAC8` |
| Marca (CTA) | `--sg-crimson-700 #C61F35` | `#D84A59` |
| Peligro | `#B42318` | `#F1797E` |
| Éxito / Aviso / Info | tokens `--sg-success/warning/info-*` | variantes dark propias |
| Focus ring | `#23669F` | `#8CBCE7` |

Reglas: crimson = CTA primario + navegación activa + identidad; danger = solo acciones irreversibles/riesgo alto; estado siempre icono + texto + color.

## Typography

- Familia única para UI: stack sans del sistema con métrica controlada (una familia, múltiples pesos — registro product). Escala rem fija, ratio 1.2. `/inicio` puede subir peso/tamaño display con `clamp()` (máx ≤ 6rem, letter-spacing ≥ -0.03em).
- Body 15–16px, line-height 1.5; datos densos permitidos en tablas. Prosa ≤ 72ch. `text-wrap: balance` en h1–h3.

## Spacing & Layout

- Shell persistente: SideNav 256px + TopBar + Outlet anidado + ToastRegion. Main max 1520px; padding 20/28/32–48px (móvil/tablet/desktop).
- Radios: 8 / 12 / 18px (`--sg-radius-*`). Sombras `--sg-shadow-sm/md`; nunca borde 1px + sombra ancha juntos como decoración.
- Z-index semántico: dropdown 1000 → sticky 1020 → offcanvas-backdrop 1040 → offcanvas/modal 1050 → toast 1080 → tooltip 1090 (escala Bootstrap).

## Components

- `AppButton` (primary/secondary/tertiary/danger/ghost/icon; ≥40px desktop, 44px táctil, radio 8–10px, peso 600, sin pills gigantes ni gradientes).
- `StatusBadge` icono+texto; `DataTable` + `TableSkeleton`; `EmptyState`/`ErrorState`/`PermissionDeniedState`/`NotFoundState`; `PageHeader` + `Breadcrumbs`; `FilterBar`; `DetailDrawer`; `ConfirmDialog` con copy de consecuencia; `Stepper` para reposición de manilla; `SensitiveField`.
- Superficies semánticas: `data`, `action`, `alert`, `context`, `preview` — no una Card genérica para todo.

## Motion

- Tokens: fast 120ms / base 180ms / slow 240ms, `cubic-bezier(0.16,1,0.3,1)`.
- Ruta: outlet opacity 0→1 + translateY(6px→0) ≤180ms; shell nunca se re-anima.
- Botones: hover translateY(-1px), press scale(0.98), 100–140ms, sin bounce.
- GSAP + ScrollTrigger solo en `/inicio`/onboarding/explicativas; `gsap.context()` + revert, `gsap.matchMedia()`, reduced-motion obligatorio; solo `transform`/`opacity`; máximo una sección pinned; prohibido en tablas/formularios/alertas.
- Loop pseudo-3D del ecosistema: CSS `perspective` + `preserve-3d` + capas SVG + rotación GSAP lenta; se pausa con reduced-motion.

## Imagery

- Fotos AVIF/WebP solo en overview/onboarding/explicativos/empty states contextuales; jamás detrás de tablas, alertas, auditoría, formularios.
- SVG originales monocromos para empty states (escudo+onda NFC, ledger+timeline, máquina+nodo); sin mascotas/robots/personas genéricas.
- Marca SmartGym: escudo geométrico plano + onda NFC + aro de manilla; crimson/carbón/plata; sin texto, gradiente, 3D ni mascota; legible 16–64px.
