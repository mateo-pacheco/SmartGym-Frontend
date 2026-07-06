export interface TableSkeletonProps {
  rows?: number
  columns?: number
  label?: string
}

/** Skeleton con la misma silueta que la tabla final; sin spinners centrales. */
export function TableSkeleton({ rows = 5, columns = 4, label = 'Cargando datos' }: TableSkeletonProps) {
  return (
    <div role="status" aria-label={label} className="p-3 d-grid gap-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="d-flex gap-3">
          {Array.from({ length: columns }).map((_, c) => (
            <span
              key={c}
              className="sg-skeleton"
              style={{ height: 14, flex: c === 0 ? 2 : 1 }}
            />
          ))}
        </div>
      ))}
      <span className="visually-hidden">{label}…</span>
    </div>
  )
}
