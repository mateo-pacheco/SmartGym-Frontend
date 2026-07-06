import { EmptyState } from '../../components/feedback/EmptyState'
import { AppButton } from '../../components/actions/AppButton'
import { Icon } from '../../components/icons/Icon'

export default function NotFoundPage() {
  return (
    <div className="d-grid align-content-center" style={{ minHeight: '60vh' }}>
      <EmptyState
        illustration={
          <span style={{ color: 'var(--sg-silver-500)' }}>
            <Icon name="buscar" size={48} title="Página no encontrada" />
          </span>
        }
        title="Esta página no existe"
        body="La ruta solicitada no corresponde a ningún módulo de SmartGym. Verifica la dirección o vuelve al centro de control."
        actions={
          <>
            <AppButton to="/panel" icon="inicio">
              Ir al centro de control
            </AppButton>
            <AppButton variant="secondary" to="/inicio">
              Ver presentación
            </AppButton>
          </>
        }
      />
    </div>
  )
}
