import { Icon, type IconName } from '../icons/Icon'

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const defaultIcon: Record<StatusTone, IconName> = {
  success: 'check',
  warning: 'alerta',
  danger: 'alerta',
  info: 'reloj',
  neutral: 'reloj',
}

export interface StatusBadgeProps {
  tone: StatusTone
  label: string
  icon?: IconName
}

/** Estado siempre con icono + texto + color; nunca solo color (AGENTS.md §4). */
export function StatusBadge({ tone, label, icon }: StatusBadgeProps) {
  return (
    <span className={`sg-status sg-status--${tone}`}>
      <Icon name={icon ?? defaultIcon[tone]} size={13} />
      {label}
    </span>
  )
}
