import { EmptyState } from './EmptyState'
import { Icon } from '../icons/Icon'

export interface PermissionDeniedStateProps {
  body: string
}

export function PermissionDeniedState({ body }: PermissionDeniedStateProps) {
  return (
    <EmptyState
      illustration={
        <span style={{ color: 'var(--sg-silver-500)' }}>
          <Icon name="privacidad" size={48} title="Acceso restringido" />
        </span>
      }
      title="Acceso restringido"
      body={body}
    />
  )
}
