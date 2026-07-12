import { Navigate } from 'react-router-dom'
import { haySesion } from '../../services/api/auth'
import { AppShell } from '../layout/AppShell'

export function RequireSession() {
  return haySesion() ? <AppShell /> : <Navigate to="/ingresar" replace />
}
