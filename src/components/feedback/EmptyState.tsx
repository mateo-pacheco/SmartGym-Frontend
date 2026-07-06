import type { ReactNode } from 'react'

export interface EmptyStateProps {
  illustration?: ReactNode
  title: string
  body: string
  actions?: ReactNode
}

export function EmptyState({ illustration, title, body, actions }: EmptyStateProps) {
  return (
    <div className="sg-empty" role="status">
      {illustration}
      <p className="sg-empty__title">{title}</p>
      <p className="sg-empty__body">{body}</p>
      {actions ? <div className="sg-empty__actions">{actions}</div> : null}
    </div>
  )
}
