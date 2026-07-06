import { Link } from 'react-router-dom'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="sg-breadcrumbs">
      <ol>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.label} aria-current={isLast ? 'page' : undefined}>
              {item.to && !isLast ? <Link to={item.to}>{item.label}</Link> : item.label}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
