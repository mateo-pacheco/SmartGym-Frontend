import { Link } from 'react-router-dom'
import { Icon } from '../icons/Icon'
import { MotionEffect } from '../animate-ui/motion-effect'

export interface ModuleGateProps {
  /** Nombre del contrato de backend que activa este módulo (no una URL). */
  contract: string
}

/* Único lugar donde una página declara que su contrato está pendiente.
   Una línea, sin repetir el mensaje en leads, captions ni estados vacíos. */
export function ModuleGate({ contract }: ModuleGateProps) {
  return (
    <MotionEffect fade slide={{ direction: 'down', offset: 14 }} delay={0.06}>
      <div className="sg-gate" role="status">
        <span className="sg-gate__icon" aria-hidden="true">
          <Icon name="reloj" size={16} />
        </span>
        <p className="sg-gate__text">
          Módulo en integración — se activa con el contrato <strong>{contract}</strong>.
        </p>
        <Link className="sg-gate__link" to="/panel">
          Ver estado de integración
        </Link>
      </div>
    </MotionEffect>
  )
}
