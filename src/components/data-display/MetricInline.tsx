export interface MetricInlineProps {
  label: string
  /** Valor real del backend. Sin dato, se muestra un guion neutro. */
  value?: string
}

/* Métrica operativa en línea: responde una pregunta concreta o declara
   la ausencia de dato con un guion. Nunca inventa valores. */
export function MetricInline({ label, value }: MetricInlineProps) {
  const empty = !value
  return (
    <div className="sg-metric">
      <span className="sg-metric__label">{label}</span>
      <span className={empty ? 'sg-metric__value sg-metric__value--empty' : 'sg-metric__value'}>
        {empty ? '—' : value}
      </span>
    </div>
  )
}
