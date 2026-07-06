# Assets de marca — SmartGym

Fecha: 2026-07-05.

## Propiedad y origen

La submarca SmartGym es **creación original de este proyecto** (SVG dibujado a mano en código). No deriva de ningún logo existente. **El logo oficial de UCACUE no fue redibujado, trazado ni aproximado**: no existe asset autorizado en el repositorio, por lo que la marca institucional solo aparece como texto ("Universidad Católica de Cuenca").

## Concepto

- **Escudo geométrico** plano: institucionalidad universitaria.
- **Onda NFC** (arcos concéntricos): la capa tecnológica de acceso.
- **Aro** (círculo abierto): la manilla / punto de acceso.
- Colores: crimson institucional **provisional** `#C61F35`, plata `#D0D2D6`, papel `#FBFAF8` sobre el escudo.
- Sin texto dentro del símbolo, sin gradientes, sin 3D, sin mascota, sin rasgos biométricos.

## Archivos

| Archivo | Uso | Notas |
|---|---|---|
| `src/assets/brand/smartgym-mark.svg` | Símbolo solo (nav, hub del loop, chips) | Legible a 16/24/32/48/64 px: trazos ≥3.5 unidades en viewBox 64 |
| `src/assets/brand/smartgym-lockup.svg` | Símbolo + nombre + línea institucional | Solo fondos claros; crear variante inversa si se necesita sobre carbón |
| `src/assets/brand/favicon.svg` | Favicon | Versión simplificada (menos arcos) para 16px |

## Restricciones de uso

1. No recolorear fuera de los tokens (`--sg-crimson-700`, plata, papel).
2. No deformar, rotar ni añadir sombras/gradientes/efectos 3D.
3. Zona de respeto: mínimo 25% del ancho del símbolo a cada lado.
4. El crimson usado es **provisional**: si UCACUE publica valores oficiales, regenerar los tres SVG y actualizar `tokens.css` en el mismo cambio.
5. El lockup no sustituye a la identidad oficial de la universidad en documentos institucionales.
