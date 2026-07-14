import { Children, Fragment, cloneElement, isValidElement, type ReactNode, type SVGProps } from 'react'

/* Set de iconos local SmartGym: 24px, trazo 1.8, esquinas redondeadas.
   Una sola familia de iconos en toda la interfaz (AGENTS.md §8). */

const paths: Record<string, ReactNode> = {
  inicio: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
    </>
  ),
  nfc: (
    <>
      <circle cx="7" cy="12" r="2" />
      <path d="M11.5 7a7.4 7.4 0 0 1 0 10" />
      <path d="M15 4a12 12 0 0 1 0 16" />
    </>
  ),
  escudo: <path d="M12 3l8 3v6c0 4.8-3.4 7.9-8 9-4.6-1.1-8-4.2-8-9V6Z" />,
  maquina: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    </>
  ),
  agenda: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9.5h16M8.5 3v4M15.5 3v4" />
    </>
  ),
  deportistas: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.6-3.4 2.8-5.2 5.5-5.2S13.9 16.6 14.5 20" />
      <path d="M16 5.5a3.1 3.1 0 0 1 0 5.8M17.8 14.6c1.6.8 2.5 2.7 2.8 5" />
    </>
  ),
  alerta: (
    <>
      <path d="M12 4 21.5 20h-19Z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.4v.2" />
    </>
  ),
  planes: (
    <>
      <rect x="5.5" y="4.5" width="13" height="17" rx="2" />
      <path d="M9.5 4.5a2.5 2.5 0 0 1 5 0" />
      <path d="m9 13.5 2 2 4-4.5" />
    </>
  ),
  xr: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0v2.5a2.5 2.5 0 0 1-2.5 2.5h-1.2a2.5 2.5 0 0 1-2.3-1.6L13.2 15h-2.4L10 16.4A2.5 2.5 0 0 1 7.7 18H6.5A2.5 2.5 0 0 1 4 15.5Z" />
    </>
  ),
  reportes: (
    <>
      <path d="M4.5 20.5V10M10.5 20.5v-16M16.5 20.5v-8" />
      <path d="M3 20.5h18" />
    </>
  ),
  auditoria: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 8.5h6M9 12.5h6M9 16.5h3.5" />
    </>
  ),
  privacidad: (
    <>
      <rect x="5" y="11" width="14" height="9.5" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  pulso: <path d="M3 12h4l2.5-6 5 12 2-6H21" />,
  gateway: (
    <>
      <circle cx="12" cy="17" r="1.6" />
      <path d="M8.5 13.5a5 5 0 0 1 7 0" />
      <path d="M5.5 10.2a9.4 9.4 0 0 1 13 0" />
    </>
  ),
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
    </>
  ),
  luna: <path d="M20.5 14A8.5 8.5 0 1 1 10 3.5a7 7 0 0 0 10.5 10.5Z" />,
  menu: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
  buscar: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  flechaDerecha: <path d="M4 12h15m-6.5-7 7 7-7 7" />,
  chevronAbajo: <path d="m6 9.5 6 6 6-6" />,
  mas: <path d="M12 5v14M5 12h14" />,
  check: <path d="m4.5 12.5 5 5L19.5 6.5" />,
  cerrar: <path d="M6 6l12 12M18 6 6 18" />,
  reloj: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2.5" />
    </>
  ),
  filtro: <path d="M3.5 5.5h17l-6.5 7.5v5.5l-4-2v-3.5Z" />,
  exportar: <path d="M12 15V3.5M7 8.5 12 3.5l5 5M5 20.5h14" />,
  salir: (
    <>
      <path d="M14 4.5H6.5A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5H14" />
      <path d="M17 8.5 20.5 12 17 15.5M9.5 12h11" />
    </>
  ),
  editar: (
    <>
      <path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 17.5Z" />
      <path d="M14 7.5l2.8 2.8" />
    </>
  ),
  basura: (
    <>
      <path d="M4.5 7h15M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2" />
      <path d="M6.5 7 7.4 19a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
    </>
  ),
}

export type IconName = keyof typeof paths

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
  /** Nombre accesible; si se omite, el icono es decorativo (aria-hidden). */
  title?: string
}

/* pathLength normalizado a 1 en cada trazo: habilita el redibujado al hover
   (estilo lucide-animated) desde CSS sin tocar los paths. */
function drawable(node: ReactNode): ReactNode {
  const children =
    isValidElement(node) && node.type === Fragment
      ? (node.props as { children?: ReactNode }).children
      : node

  return Children.map(children, (child) =>
    isValidElement(child)
      ? cloneElement(child as React.ReactElement<{ pathLength?: number }>, { pathLength: 1 })
      : child,
  )
}

export function Icon({ name, size = 20, title, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-sg-icon=""
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {drawable(paths[name])}
    </svg>
  )
}
