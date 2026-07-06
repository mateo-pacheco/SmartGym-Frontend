# Auditoría de línea base — SmartGym Frontend

Fecha: 2026-07-05.

## Estado del repositorio antes de esta entrega

El repositorio estaba **vacío de código**: contenía únicamente `AGENTS.md`, `CLAUDE.md` y archivos de configuración de IDE (`.idea/`). Verificado con un listado completo del árbol.

- Sin `package.json`, lockfile ni `node_modules`.
- Sin entrypoint, router, AppShell, tema, ni configuración de Bootstrap.
- Sin carpetas de frontend, clientes de API, tipos, tests, scripts ni assets.
- Sin documentación OpenAPI ni contratos de backend en el repositorio.
- No es un repositorio git (sin historial ni ramas locales).

## Implicaciones

1. **No hubo UI previa que auditar** en desktop ni móvil: no existían pantallazos, parpadeos ni deudas heredadas. La auditoría de navegación (`frontend-navigation-performance.md`) es por tanto **preventiva**: documenta las causas típicas y cómo esta base las evita desde el diseño.
2. **No hay contratos de API confirmados.** Toda pantalla dependiente de datos declara explícitamente el estado "sin contrato" en lugar de inventar endpoints, campos o datos (AGENTS.md §16).
3. **La paleta UCACUE es provisional** (AGENTS.md §4): no existe en el repo ningún manual de marca ni asset oficial que confirme HEX institucionales.
4. La "reconstrucción" solicitada equivale a un **levantamiento desde cero** con el stack obligatorio: React + Vite + TypeScript, React Router, Bootstrap + React Bootstrap, SCSS/CSS propio y GSAP.
