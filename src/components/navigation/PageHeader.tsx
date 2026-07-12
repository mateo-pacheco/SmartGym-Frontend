import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { MotionEffect } from '../animate-ui/motion-effect'
import { usePageMeta } from '../../lib/usePageMeta'

export interface PageHeaderProps {
  title: string
  lead?: string
  breadcrumbs: Crumb[]
  actions?: ReactNode
}

export function PageHeader({ title, lead, breadcrumbs, actions }: PageHeaderProps) {
  usePageMeta(`${title} · SmartGym UCACUE`, lead)

  return (
    <MotionEffect fade slide={{ direction: 'down', offset: 14 }}>
      <header className="sg-page-header">
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <h1>{title}</h1>
          {lead ? <p className="sg-page-header__lead">{lead}</p> : null}
        </div>
        {actions ? <div className="d-flex gap-2 flex-wrap">{actions}</div> : null}
      </header>
    </MotionEffect>
  )
}
