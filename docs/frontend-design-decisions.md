# Decisiones de diseño — SmartGym Frontend

Fecha: 2026-07-05.

## Paleta

- Se implementó **exactamente la paleta provisional de AGENTS.md §4** en `src/design/tokens.css` y `themes.css`, sin alteraciones de HEX. Etiquetada como provisional en tokens, docs y reporte: **ningún valor se afirma como oficial de UCACUE**.
- Estrategia de color: *Restrained* en pantallas operativas (crimson solo en CTA primario, navegación activa e identidad; ≤10% de superficie) y *Committed* únicamente en `/inicio` (titular con línea acentuada, anillo del loop, sección de cierre en crimson-800). Este único bloque drenched del cierre es una composición deliberada, no una inversión de tema a mitad de página.
- Tema oscuro como sistema semántico propio: carbón cálido `#151416` (no negro puro), crimson recalibrado a `#D84A59` para contraste AA sobre superficies oscuras, semánticos con variantes específicas. No es inversión automática del claro.

## Tipografía

- **Archivo Variable** (ejes wght + wdth) como **única familia** para toda la plataforma: grotesca con voz atlética-institucional, no aparece en las listas de fuentes-reflejo vetadas por las skills (Inter, Space Grotesk, Fraunces…), licencia OFL y autoalojada (sin FOUC de Google Fonts).
- Display solo en `/inicio` y cierre: `clamp(2.7rem → 4.2rem)`, peso 780, anchura 118, tracking −0.02em (dentro del piso −0.04em). Producto: escala rem fija ratio ~1.2, cuerpo 15.5px, `tabular-nums` en datos.
- Se descartó un par serif/sans: el registro product favorece una familia bien afinada, y el par habría sido reflejo editorial sin razón de marca.

## Placeholders de datos

- El glifo `—` (em-dash) se eliminó de toda la UI visible (regla dura de la taste skill). Los indicadores sin backend muestran **`N/D`** + badge "Sin datos": honesto, tabular y sin tell tipográfico.

## Superficies y componentes

- Sin franja lateral de color en navegación activa (ban de impeccable): el estado activo usa tinte de fondo + icono/texto en crimson.
- Radios: 8–14px (chips 14, cards 12–18 vía tokens); sin píldoras gigantes ni sombras pesadas; nunca borde 1px + sombra ancha como decoración conjunta.
- Consola operativa de `/inicio` sobre `--sg-ink-950` fijo en ambos temas: es un objeto (hardware de sala de control), no un cambio de tema de la sección.
- Estados vacíos con ilustración monocroma + título + explicación + (cuando aplica) acción; los de tabla viven dentro del `<tbody>` (AGENTS.md §15).

## Motion

- Tokens 120/180/240 ms + `cubic-bezier(0.16,1,0.3,1)`. Ruta: opacity+translateY(6px) ≤180 ms solo en el outlet.
- `/inicio`: única sección pinned (loop), reveals de una pasada, parallax solo en el arte decorativo del hero (nunca texto), todo bajo `gsap.matchMedia` con vía separada para `prefers-reduced-motion` (composición completa estática).
- Indicador de scroll del hero: línea de 1px animada sin texto — exigido por el encargo; se implementó en su forma más discreta y se desactiva con reduced motion.

## Fondo topográfico y parallax de cursor (ronda 2)

- Se adaptó el **principio** observado en landonorris.com (fondo de curvas de nivel + interfaz que responde al cursor) con **trazados SVG 100% propios** (`ContourField`): dos grupos de curvas con parallax diferencial. No se copió ningún asset ni código de la referencia.
- El cursor desplaza contornos y las tres capas del arte del hero (gsap.quickTo, 0.9 s power3.out) e inclina la escena 3D del loop (±4°). Activo solo con `(hover:hover) and (pointer:fine)` y sin reduced-motion; listeners `passive` y limpiados en `matchMedia`.
- Balance deliberado: máximo ~16 px de desplazamiento y 8° de tilt; el texto nunca se mueve con el cursor.

## Fotografía (ronda 2)

- Tres fotos de Unsplash verificadas manualmente (sin rostros identificables, sin logos ni pantallas legibles) para campus, cierre y login; el CDN sirve AVIF/WebP vía `auto=format`. La del cierre va en `mix-blend-mode: luminosity` bajo crimson-900 para mantener la voz monocromática con acento.

## Formularios y borradores locales (ronda 2)

- Los CTAs de alta ya no están deshabilitados: abren formularios modales diseñados (manilla = stepper de 3 pasos; reserva y deportista = modales de un paso) con validación inline junto al campo.
- Al guardar, el registro queda como **"Borrador local"** en memoria de la sesión, visible en la tabla con badge propio, y un toast lo confirma. No es dato simulado de producción: es entrada del usuario etiquetada, pendiente del contrato API. El paso de confirmación lo declara explícitamente.

## Página de acceso `/ingresar` (ronda 2)

- Split editorial (formulario + visual fotográfico con contornos), validación inline, toggle Mostrar/Ocultar accesible (`aria-pressed`), y aviso honesto al enviar: la autenticación no tiene contrato, con salida "Explorar en modo desarrollo". Todos los CTAs "Ingresar a la plataforma" apuntan ahora a `/ingresar`.

## Iconografía

- Set SVG local propio (24px, trazo 1.8, terminales redondeados): no había paquete de iconos instalado y AGENTS.md §3 prescribe set local en ese caso. Una sola familia en toda la UI.
