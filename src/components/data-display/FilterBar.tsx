import type { ReactNode } from 'react'

/** Barra de filtros de pantallas operativas: búsqueda + selects + acciones. */
export function FilterBar({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="sg-filterbar" role="search" aria-label={label}>
      {children}
    </div>
  )
}
