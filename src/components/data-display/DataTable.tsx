import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { MotionEffect } from '../animate-ui/motion-effect'
import { Icon } from '../icons/Icon'

export interface DataTableColumn {
  key: string
  header: string
  align?: 'start' | 'end'
}

export interface DataTableProps {
  caption: string
  columns: DataTableColumn[]
  rows: Array<Record<string, ReactNode>>
  /** Estado vacío renderizado dentro del cuerpo de la tabla (AGENTS.md §15). */
  emptyState?: ReactNode
  loading?: ReactNode
  /** Filas por página; la tabla nunca crece más allá de esta medida. */
  pageSize?: number
}

/** Ventana de números de página: siempre muestra primera/última y
    vecinos de la actual; los huecos se colapsan en puntos suspensivos. */
function paginas(actual: number, total: number): Array<number | 'gap'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const nucleo = new Set([1, total, actual - 1, actual, actual + 1])
  const lista: Array<number | 'gap'> = []
  let previa = 0
  for (let n = 1; n <= total; n += 1) {
    if (!nucleo.has(n)) continue
    if (previa && n - previa > 1) lista.push('gap')
    lista.push(n)
    previa = n
  }
  return lista
}

export function DataTable({
  caption,
  columns,
  rows,
  emptyState,
  loading,
  pageSize = 8,
}: DataTableProps) {
  const [pagina, setPagina] = useState(1)
  const totalPaginas = Math.max(1, Math.ceil(rows.length / pageSize))

  /* Si cambia el conjunto de datos (filtros, recarga), vuelve a la página 1. */
  useEffect(() => {
    setPagina(1)
  }, [rows.length])

  const actual = Math.min(pagina, totalPaginas)
  const visibles = useMemo(
    () => rows.slice((actual - 1) * pageSize, actual * pageSize),
    [rows, actual, pageSize],
  )
  const desde = rows.length === 0 ? 0 : (actual - 1) * pageSize + 1
  const hasta = Math.min(actual * pageSize, rows.length)

  return (
    <MotionEffect fade slide={{ direction: 'down', offset: 16 }} delay={0.12}>
      <div className="sg-table-shell">
        <div className="sg-table-wrap">
          {loading ? (
            loading
          ) : (
            <table className="sg-table">
              <caption className="visually-hidden">{caption}</caption>
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      scope="col"
                      className={c.align === 'end' ? 'text-end' : undefined}
                    >
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length}>{emptyState}</td>
                  </tr>
                ) : (
                  visibles.map((row, i) => (
                    <tr key={(actual - 1) * pageSize + i}>
                      {columns.map((c) => (
                        <td
                          key={c.key}
                          className={c.align === 'end' ? 'text-end' : undefined}
                        >
                          {row[c.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {!loading && rows.length > pageSize ? (
          <nav className="sg-pagination" aria-label={`Paginación: ${caption}`}>
            <p className="sg-pagination__resumen">
              {desde}–{hasta} de {rows.length}
            </p>
            <div className="sg-pagination__controles">
              <button
                type="button"
                className="sg-pagination__btn sg-pagination__btn--nav"
                onClick={() => setPagina(actual - 1)}
                disabled={actual === 1}
                aria-label="Página anterior"
              >
                <Icon name="flechaDerecha" size={14} />
              </button>
              {paginas(actual, totalPaginas).map((p, i) =>
                p === 'gap' ? (
                  <span key={`gap-${i}`} className="sg-pagination__gap" aria-hidden="true">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`sg-pagination__btn${p === actual ? ' sg-pagination__btn--activa' : ''}`}
                    onClick={() => setPagina(p)}
                    aria-current={p === actual ? 'page' : undefined}
                    aria-label={`Página ${p}`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                type="button"
                className="sg-pagination__btn sg-pagination__btn--nav sg-pagination__btn--siguiente"
                onClick={() => setPagina(actual + 1)}
                disabled={actual === totalPaginas}
                aria-label="Página siguiente"
              >
                <Icon name="flechaDerecha" size={14} />
              </button>
            </div>
          </nav>
        ) : null}
      </div>
    </MotionEffect>
  )
}
