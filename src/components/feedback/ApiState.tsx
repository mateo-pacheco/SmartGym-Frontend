import { Link } from 'react-router-dom'
import { Icon } from '../icons/Icon'
import { AppButton } from '../actions/AppButton'
import { ModuleGate } from './ModuleGate'
import type { EstadoApi } from '../../services/api/useApiData'

export interface ApiStateProps {
  /** Estado devuelto por useApiData. Con 'listo' no renderiza nada. */
  estado: EstadoApi
  /** Nombre legible del recurso consultado (p. ej. «Planes y revisión»). */
  contract: string
  error?: string | null
  onRetry?: () => void
}

/* Estados de conexión de un módulo. Con backend configurado y sesión válida
   nunca comunica «contrato pendiente»: solo cargando, sin permiso, sesión
   expirada o error con reintento. El estado vacío real lo maneja la tabla. */
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
        <p className="sg-gate__text">Inicia sesión para ver esta información.</p>
        <Link className="sg-gate__link" to="/ingresar">
          Ingresar
        </Link>
      </div>
    )
  }

  if (estado === 'sesion-expirada') {
    return (
      <div className="sg-gate" role="alert">
        <span className="sg-gate__icon" aria-hidden="true">
          <Icon name="reloj" size={16} />
        </span>
        <p className="sg-gate__text">Tu sesión expiró. Vuelve a ingresar para continuar.</p>
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
          Tu rol no tiene permisos para ver <strong>{contract}</strong>. Los demás módulos
          autorizados siguen disponibles.
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
        <p className="sg-gate__text">Cargando datos…</p>
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
