import { EmptyState } from './EmptyState'
import { Icon } from '../icons/Icon'
import { AppButton } from '../actions/AppButton'

export function ErrorState({ detail }: { detail: string }) {
  return (
    <EmptyState
      illustration={
        <span style={{ color: 'var(--sg-danger-700)' }}>
          <Icon name="alerta" size={48} title="Error" />
        </span>
      }
      title="Algo salió mal"
      body={detail}
      actions={
        <AppButton variant="secondary" onClick={() => window.location.reload()}>
          Recargar esta pantalla
        </AppButton>
      }
    />
  )
}
