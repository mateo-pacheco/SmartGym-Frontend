import { useState, type ReactNode } from 'react'

export interface TabDef {
  id: string
  label: string
  content: ReactNode
}

/* Pestañas accesibles (rol tablist). Conserva el diseño de la app: usa las
   clases sg-* existentes. El contenido inactivo no se monta (ahorra fetches). */
export function Tabs({ tabs, initial }: { tabs: TabDef[]; initial?: string }) {
  const [activa, setActiva] = useState(initial ?? tabs[0]?.id)

  return (
    <div>
      <div className="sg-tabs" role="tablist" aria-label="Secciones">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={activa === t.id}
            aria-controls={`panel-${t.id}`}
            className={`sg-tab${activa === t.id ? ' sg-tab--activa' : ''}`}
            onClick={() => setActiva(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) =>
        activa === t.id ? (
          <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} className="pt-3">
            {t.content}
          </div>
        ) : null,
      )}
    </div>
  )
}
