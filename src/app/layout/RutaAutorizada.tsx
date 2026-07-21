import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../services/api/useAuth'
import { PermissionDeniedState } from '../../components/feedback/PermissionDeniedState'
import { findNavItem } from './navigation'

/* Gate de rol a nivel de ruta. Los roles se leen de NAV_GROUPS, la misma
   fuente que filtra el menú: así la navegación y las rutas no pueden
   divergir. Cubre el acceso escribiendo la URL a mano, que el menú por sí
   solo no impide.

   Esto es solo interfaz: la autorización real la aplica el backend. */
export function RutaAutorizada() {
  const { pathname } = useLocation()
  const { tieneRol } = useAuth()

  const requeridos = findNavItem(pathname)?.roles
  const autorizado = !requeridos || tieneRol(...requeridos)

  if (autorizado) return <Outlet />

  return (
    <div className="sg-surface p-4">
      <PermissionDeniedState body="Tu rol no tiene acceso a este módulo. Si crees que es un error, solicítalo a la administración de SmartGym." />
    </div>
  )
}
