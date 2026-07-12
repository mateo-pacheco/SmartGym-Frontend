import type { ReactNode } from 'react'
import { ModuleTilt } from './ModuleTilt'

export function ModuleCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <ModuleTilt className={`sgm-parallax ${className}`.trim()} planeClassName="sgm-card" glare>
      <div className="sgm-card__front">{children}</div>
    </ModuleTilt>
  )
}
