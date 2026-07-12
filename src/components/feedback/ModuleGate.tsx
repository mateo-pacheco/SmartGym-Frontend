import { Link } from 'react-router-dom'
import { Icon } from '../icons/Icon'
import { MotionEffect } from '../animate-ui/motion-effect'
import { getApiConfig } from '../../services/api/client'
import { haySesion } from '../../services/api/auth'

export interface ModuleGateProps {
  /** Nombre del contrato de backend que activa este módulo (no una URL). */
  contract: string
}

/* Estado de conexión de un módulo aún no cableado a sus datos.
   Refleja la realidad: si el backend está configurado, invita a iniciar
   sesión; si no, declara que el contrato está en integración. */
export function ModuleGate({ contract }: ModuleGateProps) {
  const conectado = getApiConfig().status === 'configurado'
  const sesionActiva = haySesion()

  return (
    <MotionEffect fade slide={{ direction: 'down', offset: 14 }} delay={0.06}>
      <div className="sg-gate" role="status">
        <span className="sg-gate__icon" aria-hidden="true">
          <Icon name={conectado ? 'privacidad' : 'reloj'} size={16} />
        </span>
        {conectado && sesionActiva ? (
          <p className="sg-gate__text">
            Backend conectado — <strong>{contract}</strong> disponible con tu sesión activa.
          </p>
        ) : conectado ? (
          <>
            <p className="sg-gate__text">
              Backend conectado — inicia sesión para consultar los datos de{' '}
              <strong>{contract}</strong>.
            </p>
            <Link className="sg-gate__link" to="/ingresar">
              Ingresar
            </Link>
          </>
        ) : (
          <>
            <p className="sg-gate__text">
              Módulo en integración — se activa con el contrato <strong>{contract}</strong>.
            </p>
            <Link className="sg-gate__link" to="/panel">
              Ver estado de integración
            </Link>
          </>
        )}
      </div>
    </MotionEffect>
  )
}
