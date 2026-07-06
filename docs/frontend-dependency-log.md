# Registro de dependencias — SmartGym Frontend

Fecha: 2026-07-05. Todas las dependencias se instalaron sobre un repositorio sin `package.json` previo; cada una tiene razón frontend-only. No se añadió Tailwind, Material UI, Chakra, shadcn, Ant, Radix, Framer Motion, Three.js, Lottie, librerías de charts, estado global ni paquetes de IA.

## Dependencias de producción

| Paquete | Versión | Razón |
|---|---|---|
| `react`, `react-dom` | ^18.3 | Stack obligatorio. |
| `react-router-dom` | ^6.28 | Router obligatorio; data router con rutas anidadas y `ScrollRestoration`. Future flags v7 activados. |
| `bootstrap` | ^5.3 | Sistema de layout obligatorio; se importa vía SCSS con variables de identidad. |
| `react-bootstrap` | ^2.10 | Componentes accesibles obligatorios (Offcanvas, Form). |
| `gsap` | ^3.12 | Motion permitido por AGENTS.md §3; core + ScrollTrigger únicamente. |
| `@fontsource-variable/archivo` | ^5.2 | Única dependencia añadida por decisión propia: tipografía institucional variable (OFL), autoalojada para evitar FOUC y dependencia de Google Fonts. Solo ficheros de fuente, sin código JS. |

## Dependencias de desarrollo

| Paquete | Razón |
|---|---|
| `vite`, `@vitejs/plugin-react` | Toolchain de build/dev. |
| `typescript` | Tipado estricto exigido por la calidad del proyecto. |
| `sass` | SCSS propio + integración de Bootstrap por variables. |
| `eslint` + `@typescript-eslint/*` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` | Lint con `--max-warnings 0`. |
| `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` | Tests de componentes y de comportamiento (tema, botones, navegación). |

## No instalado deliberadamente

- **Bootstrap Icons**: no estaba presente; AGENTS.md §3 indica en ese caso usar un set SVG local propio (implementado en `src/components/icons/Icon.tsx`).
- **Librería de charts**: no existe ninguna y no hay datos confirmados que graficar; cuando existan contratos se crearán visualizaciones SVG ligeras accesibles (AGENTS.md §10).
