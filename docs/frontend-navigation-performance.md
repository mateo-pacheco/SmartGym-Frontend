# Navegación y rendimiento (pantallazos/parpadeos) — SmartGym Frontend

Fecha: 2026-07-05.

## Diagnóstico

El repositorio partía **vacío**: no existía ninguna causa real de pantallazo que corregir. Este documento registra la auditoría preventiva del checklist de AGENTS.md §12 y cómo la arquitectura entregada elimina cada causa desde el origen, más la **verificación empírica en navegador**.

## Checklist de causas y estado en esta base

| Causa típica | Estado en SmartGym |
|---|---|
| `window.location` / `<a href>` internos / recargas | Toda navegación interna usa `Link`/`NavLink` (incluido `AppButton to=…`). El único `window.location.reload()` vive en `ErrorState` como recuperación explícita de crash, no como navegación. |
| Remount del AppShell por ruta / `key={pathname}` en layout | El shell es un layout route persistente; la `key` de transición está **solo** en el wrapper del contenido del outlet (`AppShell.tsx`). Verificado empíricamente: un marcador DOM puesto en `.sg-sidenav` sobrevivió a la navegación `/panel → /operacion/accesos` (`shellPersisted: true`). |
| Suspense global / loader de pantalla completa | No existe ningún `Suspense` global ni overlay de carga; los estados de carga son locales (`TableSkeleton`). |
| Remount de providers | `ThemeProvider` y `RouterProvider` se montan una vez en `App.tsx`, fuera del árbol de rutas. |
| `transition: all` | Cero ocurrencias en el código propio; todas las transiciones enumeran propiedades (`transform`, `background-color`, `color`, `border-color`, `opacity`). |
| GSAP sin cleanup | Todo GSAP vive en `gsap.matchMedia()` con `mm.revert()` en el cleanup del efecto (`InicioPage`, `EcosystemLoop`); plugin registrado una única vez en `src/lib/gsap.ts`. |
| Imágenes sin dimensiones | Los `<img>` de marca llevan `width`/`height`; los SVG inline derivan su aspecto del `viewBox` (sin CLS). |
| Fuentes tardías / FOUT | Archivo Variable autoalojada con `font-display: swap` y fallback métrico system-ui; sin `<link>` a Google Fonts. |
| Flash de tema | Script inline en `index.html` aplica `data-theme` desde `localStorage`/`prefers-color-scheme` **antes del primer paint**; el toggle solo muta el atributo. |
| Query keys inestables / refetch por navegación | No hay capa de fetching activa (sin contrato). `getApiConfig()` es síncrono y puro; al integrar el backend, la regla queda documentada en §16 de AGENTS.md (abortar/ignorar requests obsoletos). |
| StrictMode duplicando efectos | Efectos idempotentes: matchMedia se revierte en cleanup, por lo que el doble montaje de desarrollo no acumula triggers (verificado: un solo `pin-spacer` en el DOM). |
| Scroll restoration | `<ScrollRestoration/>` del data router en la raíz. |

## Transición de ruta

`opacity 0→1` + `translateY(6px→0)` en 180 ms con `--sg-ease-product`, definida en `motion.css`; bajo `prefers-reduced-motion` degrada a fade de 160 ms y el resto de animaciones colapsan a instantáneas.

## Verificaciones empíricas (dev server, Chromium)

- Navegación `/inicio → /panel → /operacion/accesos` sin recarga (History API), shell persistente confirmado con marcador DOM.
- Sin overflow horizontal a 360, 390 y 1280 px (`scrollWidth <= innerWidth`).
- Consola sin errores (solo future-flags de React Router v6, silenciados activando los flags v7).
- Pin del loop presente una sola vez (`.pin-spacer` único, 2880 px) y órbita pausada fuera del viewport (`onToggle`).
