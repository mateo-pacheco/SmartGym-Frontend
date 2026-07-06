# Investigación visual — SmartGym Frontend

Fecha: 2026-07-05. Fuentes permitidas por AGENTS.md §6. **Declaración global: no se copió ningún layout, código, asset, texto, captura ni animación de ninguna referencia.** Las referencias se usaron exclusivamente para aprender principios y cada adaptación se documenta abajo.

## 1. landonorris.com

- **URL:** https://landonorris.com/
- **Descripción:** sitio personal de narrativa deportiva con scroll storytelling por capítulos.
- **Aprendizajes:** (a) bloques de ~1 viewport con pausas naturales que dejan procesar antes de avanzar; (b) cada sección responde una pregunta distinta sobre el sujeto (arco narrativo); (c) contraste jerárquico extremo entre display y cuerpo.
- **Adaptación SmartGym:** el `/inicio` sigue un arco por preguntas (¿qué es? → ¿cómo se conecta? → ¿qué módulos? → ¿qué pasa en operación? → ¿es seguro? → entrar), con secciones de un viewport y pacing pausado. Solo se adaptó el ritmo y la transición editorial; la animación del loop es propia.
- **Por qué sirve:** SmartGym también cuenta un sistema (deporte + tecnología) a una audiencia que no lo conoce.
- **No copiado:** ningún layout, imagen, texto ni animación.

## 2. GSAP Showcase (oficial)

- **URL:** https://gsap.com/showcase/
- **Descripción:** galería oficial de implementaciones correctas de GSAP/ScrollTrigger.
- **Aprendizajes:** (a) pinning como "beat" narrativo, no como truco; (b) scrub para progresión ligada al scroll con `ease: none`; (c) restraint: el motion sirve al contenido.
- **Adaptación SmartGym:** una única sección pinned (el loop del ecosistema) con timeline scrubbed que construye el sistema por etapas; el resto son reveals cortos de opacity/translateY.
- **Por qué sirve:** valida la implementación técnica correcta exigida por AGENTS.md §12.
- **No copiado:** ningún código de los sitios exhibidos; solo patrones documentados oficialmente por GreenSock.

## 3. Awwwards — categoría Sport

- **URL:** https://www.awwwards.com/websites/sport/
- **Descripción:** sitios deportivos premiados (Ducati, ORBEA, F1…).
- **Aprendizajes:** (a) layouts asimétricos que rompen la cuadrícula con intención; (b) elementos de gran escala que establecen dominancia inmediata; (c) espacio negativo generoso pese a contenido sustantivo.
- **Adaptación SmartGym:** hero asimétrico 5/6 columnas (texto + arte técnico), display grande solo en hero y cierre, secciones con respiración amplia y sin cards repetidas.
- **Por qué sirve:** SmartGym necesita voz deportiva premium sin caer en plantilla SaaS.
- **No copiado:** ninguna imagen ni composición concreta; solo los principios listados.

## 4. Locomotive / Studio Freight / AREA 17 (principios vía skill top-design de wondel.ai)

- **Fuente:** skill `top-design` (wondelai/skills), que sintetiza el ADN de estas agencias.
- **Aprendizajes:** (a) la tipografía ES el diseño (una familia, contraste de peso/anchura); (b) tensión monocromática: ~95% neutros + acento firme; (c) coreografía de carga: estructura → título → apoyo → arte con stagger.
- **Adaptación SmartGym:** Archivo Variable como única familia (anchura 118 en display), crimson como único acento comprometido, timeline de entrada del hero en ese orden exacto.
- **No copiado:** ningún sitio concreto de esas agencias fue reproducido.

## 5. Dashboards industriales / sistemas de operación (principios vía skills impeccable-product y refactoring-ui)

- **Fuente:** registro *product* de la skill `impeccable` + `refactoring-ui` (wondel.ai).
- **Aprendizajes:** (a) familiaridad ganada: el operador debe confiar sin pausar en cada control; (b) skeletons con la silueta del contenido, no spinners; (c) estados semánticos estandarizados (hover/focus/disabled/empty/error) en todos los módulos.
- **Adaptación SmartGym:** vocabulario único de componentes (`AppButton`, `StatusBadge`, `DataTable`…), consola operativa tipo sala de control con celdas de dato + estado declarado, taxonomías de estado visibles (telemetría, severidad clínica, ciclo de manilla).
- **No copiado:** ningún dashboard concreto.

## 6. Plataformas health-tech (principio de calma clínica)

- **Fuente:** requisitos de AGENTS.md §15 contrastados con los criterios de severidad/jerarquía del registro product de impeccable.
- **Aprendizajes:** (a) lo crítico domina la jerarquía y nunca compite con decoración; (b) el color jamás es la única señal (icono + texto + color); (c) mínima exposición de datos sensibles.
- **Adaptación SmartGym:** páginas clínicas sin fotos ni motion de scroll, taxonomía de severidad explícita en Alertas, `SensitiveField`-policy (NFC/HMAC/tokens nunca en pantalla), estados con `StatusBadge` triple señal.
- **No copiado:** no aplica reproducción visual.

## 7. Emil Kowalski — animations.dev (principios vía skill emil-design-eng)

- **Fuente:** skill `emil-design-eng` (filosofía de design engineering de Emil Kowalski).
- **Aprendizajes:** (a) frecuencia decide si algo anima (acciones repetidas: sin animación); (b) `ease-out` en entradas, nunca `ease-in`; (c) botones que responden al tacto (`scale(0.98)` en press).
- **Adaptación SmartGym:** transición de ruta 180 ms ease-out, microinteracciones de botón 120–140 ms, tooltips/toggles sin animación de teclado.
- **No copiado:** ningún componente de sus librerías (Sonner/Vaul) fue usado ni imitado visualmente.
