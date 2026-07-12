import { Link } from 'react-router-dom'
import { Icon } from '../icons/Icon'
import { AppButton } from '../actions/AppButton'
import { ModuleGate } from './ModuleGate'
import type { EstadoApi } from '../../services/api/useApiData'

export interface ApiStateProps {
  /** Estado devuelto por useApiData. Con 'listo' no renderiza nada. */
  estado: EstadoApi
  /** Nombre del contrato que activa el módulo (para el estado sin backend). */
  contract: string
  error?: string | null
  onRetry?: () => void
}

/* Estados de conexión de un módulo, en una sola línea coherente con
   ModuleGate: sin backend, sin sesión, cargando o error con reintento. */
export function ApiState({ estado, contract, error, onRetry }: ApiStateProps) {
  if (estado === 'listo') return null

  if (estado === 'sin-backend') {
    return <ModuleGate contract={contract} />
  }

  if (estado === 'sin-sesion') {
    return (
      <div className="sg-gate" role="status">
        <span className="sg-gate__icon" aria-hidden="true">
          <Icon name="privacidad" size={16} />
        </span>
        <p className="sg-gate__text">
          Backend conectado — inicia sesión para consultar los datos reales de{' '}
          <strong>{contract}</strong>.
        </p>
        <Link className="sg-gate__link" to="/ingresar">
          Ingresar
        </Link>
      </div>
    )
  }

  if (estado === 'sin-permiso') {
    return (
      <div className="sg-gate" role="status">
        <span className="sg-gate__icon" aria-hidden="true">
          <Icon name="privacidad" size={16} />
        </span>
        <p className="sg-gate__text">
          Sesión activa — este perfil no necesita acceso a los datos administrativos de{' '}
          <strong>{contract}</strong>. Los demás módulos autorizados continúan disponibles.
        </p>
      </div>
    )
  }

  if (estado === 'cargando') {
    return (
      <div className="sg-gate" role="status" aria-live="polite">
        <span className="sg-gate__icon" aria-hidden="true">
          <Icon name="reloj" size={16} />
        </span>
        <p className="sg-gate__text">Consultando datos reales del backend…</p>
      </div>
    )
  }

  return (
    <div className="sg-gate" role="alert">
      <span className="sg-gate__icon" aria-hidden="true">
        <Icon name="alerta" size={16} />
      </span>
      <p className="sg-gate__text">{error ?? 'El backend respondió con un error.'}</p>
      {onRetry ? (
        <AppButton variant="tertiary" size="sm" onClick={onRetry}>
          Reintentar
        </AppButton>
      ) : null}
    </div>
  )
}
