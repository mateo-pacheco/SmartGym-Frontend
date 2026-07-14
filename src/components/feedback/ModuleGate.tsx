import { Icon } from '../icons/Icon'
import { MotionEffect } from '../animate-ui/motion-effect'

export interface ModuleGateProps {
  /** Nombre legible del recurso (para el aviso de backend no disponible). */
  contract: string
}

/* Aviso neutro para el único caso de "sin backend": la app se abrió sin
   VITE_SMARTGYM_API_URL configurada. No habla de contratos ni de integración:
   en producción el backend está configurado y este aviso no aparece. */
export function ModuleGate({ contract }: ModuleGateProps) {
  return (
    <MotionEffect fade slide={{ direction: 'down', offset: 14 }} delay={0.06}>
      <div className="sg-gate" role="status">
        <span className="sg-gate__icon" aria-hidden="true">
          <Icon name="alerta" size={16} />
        </span>
        <p className="sg-gate__text">
          No hay conexión configurada con el servidor SmartGym para consultar{' '}
          <strong>{contract}</strong>.
        </p>
      </div>
    </MotionEffect>
  )
}
