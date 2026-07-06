import { StatusBadge, type StatusTone } from './StatusBadge'

export interface MetricInlineProps {
  label: string
  value: string
  tone?: StatusTone
  statusLabel?: string
}

/* Métrica operativa en línea: responde una pregunta concreta o declara
   explícitamente que no hay datos. Nunca inventa valores. */
export function MetricInline({ label, value, tone, statusLabel }: MetricInlineProps) {
  return (
    <div className="d-flex flex-column gap-1 py-1">
      <span style={{ fontSize: '0.8rem', color: 'var(--sg-text-secondary)', fontWeight: 500 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
      {tone && statusLabel ? (
        <span>
          <StatusBadge tone={tone} label={statusLabel} />
        </span>
      ) : null}
    </div>
  )
}
