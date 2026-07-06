import type { IconName } from '../../components/icons/Icon'

export interface NavItem {
  to: string
  label: string
  icon: IconName
}

export interface NavGroup {
  label: string | null
  items: NavItem[]
}

/* Navegación por grupos de rol (AGENTS.md §13). */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [{ to: '/panel', label: 'Centro de control', icon: 'inicio' }],
  },
  {
    label: 'Operación',
    items: [
      { to: '/operacion/accesos', label: 'Acceso NFC', icon: 'nfc' },
      { to: '/operacion/maquinas', label: 'Máquinas y telemetría', icon: 'maquina' },
      { to: '/operacion/agenda', label: 'Agenda y aforo', icon: 'agenda' },
    ],
  },
  {
    label: 'Atención deportiva',
    items: [
      { to: '/atencion/deportistas', label: 'Deportistas', icon: 'deportistas' },
      { to: '/atencion/alertas', label: 'Alertas médicas', icon: 'alerta' },
      { to: '/atencion/planes', label: 'Planes y revisiones', icon: 'planes' },
    ],
  },
  {
    label: 'Experiencias',
    items: [{ to: '/experiencias/xr', label: 'Exergames XR', icon: 'xr' }],
  },
  {
    label: 'Análisis',
    items: [{ to: '/analisis/reportes', label: 'Reportes', icon: 'reportes' }],
  },
  {
    label: 'Administración',
    items: [
      { to: '/administracion/auditoria', label: 'Auditoría', icon: 'auditoria' },
      { to: '/administracion/privacidad', label: 'Privacidad y consentimientos', icon: 'privacidad' },
    ],
  },
]

export function findNavItem(pathname: string): NavItem | undefined {
  for (const group of NAV_GROUPS) {
    const hit = group.items.find((item) => pathname.startsWith(item.to))
    if (hit) return hit
  }
  return undefined
}
