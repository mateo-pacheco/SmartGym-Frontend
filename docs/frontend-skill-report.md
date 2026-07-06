# Reporte de skills — SmartGym Frontend

Fecha: 2026-07-05. Descubrimiento ejecutado con el workflow real `find-skills` (CLI `npx skills find`) **antes de escribir código**, más el inventario de skills instaladas en el entorno Claude Code.

## Búsquedas exactas exigidas por AGENTS.md / CLAUDE.md

| Búsqueda | Resultado en el registro (skills.sh) | Estado |
|---|---|---|
| `impeccable design` | `pbakaus/impeccable@frontend-design` (53.9K instalaciones) | **Existe** — instalada localmente como `impeccable` |
| `wondel.ai skills` | `wondelai/skills@*` (web-typography, refactoring-ui, top-design, ux-heuristics…) | **Existe** — se instalaron `refactoring-ui`, `web-typography`, `top-design` |
| `emil kowalski` | `emilkowalski/skills@emil-design-eng` (117.6K instalaciones) | **Existe** — instalada localmente como `emil-design-eng` |
| `taste skill` | `leonxlnx/taste-skill@*` (design-taste-frontend 220K, high-end-visual-design 174K…) | **Existe** — se instalaron `design-taste-frontend` y `high-end-visual-design` |
| `frontend-design` | `anthropics/skills@frontend-design` (627.6K instalaciones) | **Existe** — instalada localmente |
| `accessibility` | `addyosmani/web-quality-skills@accessibility` y otras | **Existe** — localmente disponible `web-accessibility` |
| `react performance` | varias (`nickcrew/…`, `dimillian/…`) | **Existe** — localmente disponible `vercel-react-best-practices` |
| `gsap` | `greensock/gsap-skills@gsap-core`, `@gsap-scrolltrigger` (oficiales de GreenSock) | **Existe** — instaladas localmente |

## Skills cargadas y aplicadas de verdad en esta entrega

1. **`impeccable`** (pbakaus/impeccable — "impeccable design"). Se ejecutó su setup real: `context.mjs` (reportó `NO_PRODUCT_MD`), se siguió `reference/init.md` creando `PRODUCT.md` y `DESIGN.md`, y se leyeron los registros `reference/product.md` y `reference/brand.md`. Aplicado: prohibiciones absolutas (sin side-stripes → se eliminó la franja del nav activo; sin gradient text; sin card grids idénticas; techo de display ≤6rem y tracking ≥ −0.04em), registro *product* para pantallas operativas y *brand* solo para `/inicio`.
2. **`emil-design-eng`** (Emil Kowalski). Aplicado: easing custom `cubic-bezier(0.16,1,0.3,1)`, botones con `scale(0.98)` en `:active` y hover `translateY(-1px)` bajo `@media (hover:hover) and (pointer:fine)`, sin animar acciones de teclado, sin `scale(0)`, duraciones UI ≤180 ms, transiciones interrumpibles (CSS transitions, no keyframes en UI dinámica), stagger corto 70–120 ms.
3. **`design-taste-frontend`** (leonxlnx/taste-skill — "taste skill"). Aplicado: pre-flight check completo (se corrigieron 3 fallos reales detectados en el navegador: CTA del nav partido en 2 líneas → "Ingresar"; hero que desbordaba el viewport → clamp reducido a 4.2rem; em-dashes visibles → reemplazados por "N/D"); disciplina de eyebrows (solo 1: línea institucional del hero); prohibición de dots decorativos, marquees y section-numbers; jerarquía de héroe ≤4 elementos.
4. **`top-design`** (wondelai/skills — wondel.ai). Aplicado: momento firma diseñado primero (loop pseudo-3D del ecosistema), contraste tipográfico display/cuerpo con una sola familia variable (peso + anchura), blanco activo, composición asimétrica del hero, motion coreografiado (carga del hero por capas), colores con calidez física (nunca #000/#fff puros).
5. **`gsap-core`** y **`gsap-scrolltrigger`** (oficiales GreenSock). Aplicado: registro único del plugin (`src/lib/gsap.ts`), `gsap.matchMedia()` con condiciones (`prefers-reduced-motion`, desktop/móvil) y `mm.revert()` en cleanup, ScrollTrigger solo en animaciones top-level, `scrub` + `pin` en una única sección, `ease: none` en el anillo scrubbed, spin pausado fuera del viewport vía `onToggle`.
6. **`refactoring-ui`** y **`web-typography`** (wondelai/skills). Instaladas en esta sesión; principios aplicados: escala tipográfica contenida (ratio ~1.2 en producto), jerarquía por peso/color antes que tamaño, tabular-nums en datos, una sola familia (Archivo Variable) elegida por voz institucional-deportiva y no de la lista de reflejos vetados.

## Skills detectadas, disponibles y NO cargadas (sin reclamo de uso)

- `frontend-design` (anthropics), `web-accessibility`, `vercel-react-best-practices`, `responsive-design`, `high-end-visual-design`: existen y están instaladas, pero no se cargaron en contexto en esta sesión para no duplicar guía ya cubierta por las skills anteriores. **No se afirma su uso.** La accesibilidad se implementó siguiendo directamente el baseline de `AGENTS.md` §17 (WCAG 2.1 AA) y el rendimiento React siguiendo `AGENTS.md` §18.

## No encontradas con ese nombre literal

- No existe una skill llamada literalmente `taste skill` ni `wondel.ai skills`: son los repositorios `leonxlnx/taste-skill` y `wondelai/skills`, cuyas skills concretas sí se instalaron y usaron (arriba). No se fabricó disponibilidad de ninguna skill.
