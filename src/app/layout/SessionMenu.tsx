import { useNavigate } from 'react-router-dom'
import { AppButton } from '../../components/actions/AppButton'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { useAuth } from '../../services/api/useAuth'

const ETIQUETA_ROL: Record<string, string> = {
  ADMINISTRADOR: 'Administrador',
  ESTUDIANTE: 'Estudiante',
  MEDICO: 'Médico',
  ENTRENADOR: 'Entrenador',
}

/* Indicador reactivo de sesión: muestra el rol activo y permite cerrar sesión.
   Al salir, limpia el token y regresa a la presentación pública. */
export function SessionMenu() {
  const { autenticado, roles, usuario, salir } = useAuth()
  const navigate = useNavigate()

  if (!autenticado) return null

  const rol = roles[0]
  const etiqueta = rol ? ETIQUETA_ROL[rol] ?? rol : 'Sesión activa'

  const cerrar = () => {
    salir()
    navigate('/inicio', { replace: true })
  }

  return (
    <div className="sg-session d-flex align-items-center gap-2">
      <span className="d-none d-sm-inline-flex" title={usuario ?? undefined}>
        <StatusBadge tone="info" label={etiqueta} icon="privacidad" />
      </span>
      <AppButton variant="ghost" size="sm" icon="salir" onClick={cerrar}>
        <span className="d-none d-md-inline">Salir</span>
      </AppButton>
    </div>
  )
}
