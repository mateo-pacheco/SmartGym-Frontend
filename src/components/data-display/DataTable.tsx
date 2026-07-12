import type { ReactNode } from 'react'
import { MotionEffect } from '../animate-ui/motion-effect'

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
}

export function DataTable({ caption, columns, rows, emptyState, loading }: DataTableProps) {
  return (
    <MotionEffect fade slide={{ direction: 'down', offset: 16 }} delay={0.12}>
      <div className="sg-table-wrap">
      {loading ? (
        loading
      ) : (
        <table className="sg-table">
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={c.align === 'end' ? 'text-end' : undefined}>
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
              rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c.key} className={c.align === 'end' ? 'text-end' : undefined}>
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
    </MotionEffect>
  )
}
