import type { ReactNode } from 'react'
import { MotionEffect } from '../animate-ui/motion-effect'

export interface EmptyStateProps {
  illustration?: ReactNode
  title: string
  body: string
  actions?: ReactNode
}

export function EmptyState({ illustration, title, body, actions }: EmptyStateProps) {
  return (
    <div className="sg-empty" role="status">
      {illustration ? (
        <MotionEffect fade zoom={{ initialScale: 0.88 }} blur="4px" delay={0.2}>
          {illustration}
        </MotionEffect>
      ) : null}
      <p className="sg-empty__title">{title}</p>
      <p className="sg-empty__body">{body}</p>
      {actions ? <div className="sg-empty__actions">{actions}</div> : null}
    </div>
  )
}
