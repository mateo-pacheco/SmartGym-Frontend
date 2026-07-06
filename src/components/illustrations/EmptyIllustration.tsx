/* Ilustraciones originales monocromáticas para estados vacíos.
   Sin mascotas, robots ni personas (AGENTS.md §7). Trazo sobrio sobre tokens. */

export type IllustrationName = 'nfc' | 'auditoria' | 'iot' | 'riesgo' | 'plan' | 'agenda'

const art: Record<IllustrationName, JSX.Element> = {
  nfc: (
    <>
      {/* Escudo + onda NFC + punto de acceso */}
      <path d="M60 22l26 9v22c0 16-11 26-26 30-15-4-26-14-26-30V31Z" />
      <circle cx="52" cy="52" r="8" />
      <path d="M66 40a17 17 0 0 1 0 24" />
      <path d="M73 34a26 26 0 0 1 0 36" opacity="0.45" />
    </>
  ),
  auditoria: (
    <>
      {/* Libro de auditoría + línea temporal */}
      <rect x="30" y="20" width="44" height="56" rx="4" />
      <path d="M40 34h24M40 44h24M40 54h14" />
      <path d="M84 28v48" opacity="0.45" />
      <circle cx="84" cy="38" r="3.5" />
      <circle cx="84" cy="58" r="3.5" opacity="0.45" />
    </>
  ),
  iot: (
    <>
      {/* Máquina + nodo de telemetría */}
      <path d="M32 78V42h28v36" />
      <path d="M26 78h68" />
      <path d="M60 50h18v28" opacity="0.45" />
      <circle cx="82" cy="34" r="6" />
      <path d="M74 26a11 11 0 0 1 16 0" opacity="0.45" />
      <path d="M82 40v10" />
    </>
  ),
  riesgo: (
    <>
      {/* Pulso + escudo clínico */}
      <path d="M22 56h16l6-14 10 26 6-12h10" />
      <path d="M84 30l16 6v13c0 10-7 16-16 19-9-3-16-9-16-19V36Z" opacity="0.45" />
      <path d="m78 48 4 4 8-9" />
    </>
  ),
  plan: (
    <>
      {/* Plan + checklist */}
      <rect x="34" y="18" width="46" height="60" rx="4" />
      <path d="M48 18a8 8 0 0 1 16 0" />
      <path d="m44 40 4 4 8-9M60 42h14" />
      <path d="m44 58 4 4 8-9M60 60h14" opacity="0.45" />
    </>
  ),
  agenda: (
    <>
      {/* Agenda + capacidad */}
      <rect x="24" y="24" width="56" height="52" rx="4" />
      <path d="M24 38h56M38 16v12M66 16v12" />
      <path d="M36 50h8v14h-8zM50 56h8v8h-8zM64 46h8v18h-8z" opacity="0.45" />
    </>
  ),
}

export function EmptyIllustration({ name }: { name: IllustrationName }) {
  return (
    <svg
      viewBox="0 0 112 96"
      width="112"
      height="96"
      fill="none"
      stroke="var(--sg-silver-500)"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {art[name]}
    </svg>
  )
}
