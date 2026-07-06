# Product

## Register

product

> Nota: el producto tiene una superficie dual. Las pantallas operativas (NFC, telemetría, clínica, auditoría) son registro **product**. La ruta `/inicio` (product overview autenticado) es la única superficie con permisos de registro **brand**: scroll editorial, hero, storytelling del ecosistema. Esta distinción viene mandatada por `AGENTS.md` §12 ("Allowed motion areas").

## Users

- **Administradores** universitarios: gestionan manillas NFC, accesos, gateways IoT, agenda/aforo, roles, consentimientos y auditoría. Contexto: sala de control / oficina, trabajo por lotes y por excepción.
- **Médicos deportivos**: revisan expedientes, alertas de riesgo con severidad, aprueban planes. Contexto clínico: necesitan calma, legibilidad y cero decoración sobre datos sensibles.
- **Entrenadores y nutricionistas**: planes, revisiones, adherencia, seguimiento, telemetría de sesiones.
- **Deportistas**: su expediente, planes, reservas, XR. Contexto móvil frecuente.

Trabajo a realizar: operar un ecosistema deportivo-sanitario universitario con trazabilidad — validar accesos, escalar riesgos médicos, mantener máquinas conectadas, aprobar planes con responsabilidad humana.

## Product Purpose

SmartGym es la plataforma de la Universidad Católica de Cuenca (UCACUE) que une acceso NFC, expediente deportivo-sanitario, escalamiento de riesgo médico, telemetría IoT de máquinas, planes y revisión humana, adherencia, XR, agenda/aforo, reportes y gobernanza. Éxito = operadores que confían en la interfaz para decisiones con consecuencias (bloquear una manilla, aprobar un plan, atender una alerta) en ≤3 interacciones.

## Brand Personality

**Institucional, precisa, serena.** Software de operaciones deportivo-sanitarias de grado universitario: sala de control clara cuando el riesgo lo exige, calma clínica en contextos médicos, alto rendimiento contenido en contextos de atleta. Un solo sistema, no páginas Bootstrap sueltas. Todo el copy en español.

## Anti-references

- Dashboard Bootstrap genérico: rejilla de 4 KPI cards, todo dentro de la misma card redondeada, pantallas "welcome back".
- Plantilla SaaS con gradientes morados/azules, glassmorphism, neón, blobs.
- Landing de marketing vacía, ecommerce, web de gimnasio comercial.
- Estética "IA": robots, mascotas, motivos de chispas/gradiente.
- Copias de Awwwards / Dribbble / landonorris.com — solo principios, jamás layouts, assets ni animaciones.

## Design Principles

1. **La información manda**: tablas, estados y jerarquía antes que decoración; ninguna foto detrás de datos clínicos, auditoría o formularios de seguridad.
2. **Una sola pieza de software**: shell persistente, vocabulario de componentes idéntico en todos los módulos, transición de ruta ≤180 ms sin pantallazos.
3. **El riesgo se ve primero**: severidad clínica y estados de seguridad con icono + texto + color, nunca solo color, nunca ocultos tras charts decorativos.
4. **Motion con propósito**: GSAP solo donde clarifica (hero editorial de `/inicio`, reveals, transición de outlet); jamás en tablas, formularios o alertas activas.
5. **Nada sensible en la superficie**: sin NFC/HMAC/tokens/secretos/identificadores privados en UI, URLs, logs ni mocks.

## Accessibility & Inclusion

WCAG 2.1 AA: skip-to-content, focus visible, focus trap en modales, Escape cierra, labels asociados, errores junto al campo, targets táctiles 44px, contraste verificado en ambos temas, `prefers-reduced-motion` respetado en toda animación, charts con resumen textual, navegación 100% por teclado.
