import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../services/api/useAuth'
import { AppShell } from '../layout/AppShell'

/* Guarda de rutas reactiva: se re-renderiza cuando la sesión cambia. Solo
   redirige a /ingresar cuando NO existe una sesión válida. Mientras el store
   inicializa no redirige (evita expulsar a un usuario con sesión persistida). */
export function RequireSession() {
  const { autenticado, inicializando } = useAuth()
  const location = useLocation()

  if (inicializando) return null
  if (autenticado) return <AppShell />
  return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />
}
