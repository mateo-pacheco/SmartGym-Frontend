/* Paneles visuales originales por módulo: diagramas de línea sobre tokens,
   sin texto embebido, decorativos (aria-hidden) porque el copy adyacente
   describe el contenido. */

export type ModuleVisualName = 'nfc' | 'iot' | 'riesgo' | 'agenda'

const visuals: Record<ModuleVisualName, JSX.Element> = {
  nfc: (
    <>
      {/* Manilla → onda → lector → escudo verificado */}
      <circle cx="86" cy="150" r="44" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="86" cy="150" r="30" stroke="currentColor" strokeWidth="2.2" opacity="0.45" />
      <circle cx="86" cy="106" r="7" fill="var(--sg-brand)" />
      <path d="M150 150 H222" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round" />
      <rect x="232" y="106" width="70" height="88" rx="10" stroke="currentColor" strokeWidth="2.2" />
      <path d="M256 136 a14 14 0 0 1 0 28 M266 126 a26 26 0 0 1 0 48" stroke="var(--sg-brand)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M312 150 H384" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round" />
      <path d="M436 96l40 14v30c0 24-17 39-40 46-23-7-40-22-40-46v-30Z" stroke="currentColor" strokeWidth="2.2" />
      <path d="m420 148 12 12 24-26" stroke="var(--sg-success-700)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  iot: (
    <>
      {/* Panel de telemetría con serie temporal y nodos */}
      <rect x="40" y="60" width="440" height="180" rx="12" stroke="currentColor" strokeWidth="2.2" />
      <path d="M40 110 H480 M40 160 H480 M40 210 H480" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <path
        d="M60 190 L110 176 150 196 200 150 250 168 300 120 350 138 400 96 456 116"
        stroke="var(--sg-brand)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="200" cy="150" r="5" fill="var(--sg-brand)" />
      <circle cx="400" cy="96" r="5" fill="var(--sg-brand)" />
      <circle cx="80" cy="264" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="140" cy="264" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="200" cy="264" r="6" stroke="var(--sg-warning-700)" strokeWidth="2" />
      <path d="M96 264h28M156 264h28" stroke="currentColor" strokeWidth="1.6" opacity="0.5" />
    </>
  ),
  riesgo: (
    <>
      {/* Triaje por severidad con línea de pulso */}
      <rect x="48" y="56" width="424" height="52" rx="9" stroke="var(--sg-danger-700)" strokeWidth="2.4" />
      <circle cx="76" cy="82" r="7" fill="var(--sg-danger-700)" />
      <path d="M100 82 h180" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="48" y="124" width="424" height="52" rx="9" stroke="currentColor" strokeWidth="2" opacity="0.75" />
      <circle cx="76" cy="150" r="7" fill="var(--sg-warning-700)" />
      <path d="M100 150 h130" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      <rect x="48" y="192" width="424" height="52" rx="9" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <circle cx="76" cy="218" r="7" fill="var(--sg-info-700)" />
      <path d="M100 218 h90" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
      <path
        d="M330 150 h24l10-22 18 44 12-22h34"
        stroke="var(--sg-brand)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  agenda: (
    <>
      {/* Ocupación por franja horaria */}
      <path d="M60 250 H460" stroke="currentColor" strokeWidth="2.2" />
      <path d="M60 70 V250" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      <rect x="92" y="176" width="42" height="74" rx="5" stroke="currentColor" strokeWidth="2.2" />
      <rect x="156" y="140" width="42" height="110" rx="5" stroke="currentColor" strokeWidth="2.2" />
      <rect x="220" y="96" width="42" height="154" rx="5" fill="var(--sg-brand)" fillOpacity="0.14" stroke="var(--sg-brand)" strokeWidth="2.4" />
      <rect x="284" y="120" width="42" height="130" rx="5" stroke="currentColor" strokeWidth="2.2" />
      <rect x="348" y="188" width="42" height="62" rx="5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M60 96 H460" stroke="var(--sg-danger-700)" strokeWidth="1.8" strokeDasharray="6 6" />
    </>
  ),
}

export function ModuleVisual({ name }: { name: ModuleVisualName }) {
  return (
    <svg viewBox="0 0 520 300" fill="none" aria-hidden="true" style={{ color: 'var(--sg-ink-600)' }}>
      {visuals[name]}
    </svg>
  )
}
