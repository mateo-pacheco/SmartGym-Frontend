# Manifiesto de assets — SmartGym Frontend

Fecha: 2026-07-05. Regla aplicada: ningún asset descargado de Awwwards/Dribbble/sitios de referencia; **todo el arte de esta entrega es SVG original creado para SmartGym**. Los slots fotográficos definidos por AGENTS.md §7 quedan declarados y vacíos hasta contar con fotografías con licencia verificable (ver "Slots pendientes").

## Assets entregados (todos originales, licencia: propiedad del proyecto)

| ID | Pantalla / uso | Fuente | Formato | Tamaño | Alt / accesibilidad | Carga | Ruta |
|---|---|---|---|---|---|---|---|
| `smartgym-mark` | SideNav, nav de `/inicio`, hub del loop 3D | Creación original (escudo + onda NFC + aro de manilla) | SVG | 0.6 KB | Decorativo junto al nombre (`alt=""`, dimensiones explícitas 28–72px) | Eager (marca) | `src/assets/brand/smartgym-mark.svg` |
| `smartgym-lockup` | Documentación de marca / usos horizontales | Creación original | SVG | 0.9 KB | `role="img"` con etiqueta en español | Bajo demanda | `src/assets/brand/smartgym-lockup.svg` |
| `favicon` | Pestaña del navegador | Creación original | SVG | 0.4 KB | n/a | Eager | `src/assets/brand/favicon.svg` |
| `hero-facility-art` | Hero de `/inicio` | Creación original: plano arquitectónico por capas (estructura/equipos/señales) | SVG inline (componente) | ~3 KB | `role="img"` + `aria-label` descriptivo en español | Eager (LCP del hero) | `src/features/inicio/HeroFacility.tsx` |
| `module-visual-nfc/iot/riesgo/agenda` | Secciones de módulos de `/inicio` | Creación original: diagramas de línea | SVG inline | ~1 KB c/u | Decorativos (`aria-hidden`, el copy adyacente describe) | Lazy por viewport (reveal) | `src/features/inicio/ModuleVisuals.tsx` |
| `empty-nfc/auditoria/iot/riesgo/plan/agenda` | Estados vacíos de módulos | Creación original: monocromo, sin mascotas/robots/personas | SVG inline | <1 KB c/u | Decorativos (`aria-hidden`; el `EmptyState` lleva título+texto) | Con el estado | `src/components/illustrations/EmptyIllustration.tsx` |
| `icon-set` | Toda la UI | Creación original: 24px, trazo 1.8 consistente | SVG inline | <0.5 KB c/u | `aria-hidden` salvo uso con `title` | Inline | `src/components/icons/Icon.tsx` |
| `archivo-variable` | Tipografía única | Fontsource — fuente Archivo (Omnibus-Type), licencia **OFL 1.1**, autoalojada | WOFF2 (ejes wght+wdth) | 90/86/34 KB por subset | `font-display: swap` del paquete | Preload por Vite | `node_modules/@fontsource-variable/archivo` |

## Fotografías verificadas e incorporadas (ronda 2, 2026-07-05)

Fuente: Unsplash (hotlink oficial del CDN `images.unsplash.com` con `auto=format`, que sirve AVIF/WebP automáticamente). **Licencia Unsplash** (uso libre comercial y no comercial, sin permiso adicional). Cada imagen fue **descargada y revisada visualmente** antes de usarse: sin rostros identificables, sin logos/marcas legibles, sin pantallas legibles. Candidatas rechazadas en la verificación: interior de gimnasio con mural de persona, atleta con logos Nike/Adidas visibles, mancuernas y barra con marcas legibles ("origin", "GYM").

| ID | Foto (id Unsplash) | Autoría | Uso | Alt / tratamiento | Carga |
|---|---|---|---|---|---|
| `campus-aerea` | `photo-1557149622-823cf0c28758` | CHUTTERSNAP | Banda editorial "Pensado para el deporte universitario real" en `/inicio` | Alt descriptivo en español; personas solo a distancia aérea no identificable; reveal por clip-path ligado al scroll | `loading="lazy"`, `srcSet` 800/1400/2000, dimensiones explícitas |
| `pista-cierre` | `photo-1518609875317-99d279eb2501` | H&CO | Fondo del cierre crimson de `/inicio` | Decorativa (`alt=""`), mezcla luminosity + overlay crimson-900 (contraste AA del texto verificado por diseño) | `loading="lazy"`, dimensiones explícitas |
| `pista-login` | `photo-1560281105-d58d81dfc5bc` | Jean Carlo Emer | Columna visual de `/ingresar` | Decorativa (`alt=""`), gradiente de legibilidad para la leyenda | `loading="lazy"`, `srcSet` 900/1400/2000, solo visible ≥992px |

Cumplen AGENTS.md §7: aparecen solo en overview (`/inicio`) y acceso (`/ingresar`), nunca detrás de tablas, formularios operativos, alertas ni auditoría.

## Slots fotográficos declarados y pendientes (AGENTS.md §7)

Los siguientes slots existen en el plan de assets pero **no se rellenaron** porque en esta sesión no fue posible verificar licencia, ausencia de logos y ausencia de rostros identificables de fotografías reales. En su lugar, las superficies que los usarían llevan arte SVG original; ninguna pantalla quedó con hueco vacío.

| ID slot | Dónde iría | Brief de búsqueda/generación (de AGENTS.md) | Estado |
|---|---|---|---|
| `hero-campus-training` | Hero `/inicio` (podría reemplazar/acompañar al SVG) | instalación universitaria de alto rendimiento, editorial, sin logos/rostros/pantallas legibles | Pendiente de fotografía autorizada |
| `nfc-access-closeup` | Explicador/onboarding NFC | manilla NFC neutra junto a lector, acento crimson, sin marcas | Pendiente |
| `iot-machine-detail` | Explicador IoT | máquina conectada con sensor edge, grafito/plata/crimson | Pendiente |
| `clinical-team-review` | Explicador clínico | profesional revisando datos no identificables, sin pantallas legibles | Pendiente |
| `xr-training-space` | Explicador XR | atleta de espaldas con visor MR, sin logos ni UI visible | Pendiente |

Requisitos al rellenarlos: AVIF/WebP, `<picture>`/`srcSet`, `width`/`height` explícitos, `loading="lazy"` fuera del fold, alt en español si son informativas, y **nunca** detrás de tablas, formularios, alertas o auditoría.
