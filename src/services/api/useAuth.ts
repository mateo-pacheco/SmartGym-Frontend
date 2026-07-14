/* Hook reactivo de sesión. Cualquier componente que lo use se re-renderiza
   cuando la sesión cambia (login, logout, refresh, expiración por 401). */

import { useSyncExternalStore } from 'react'
import { authStore, type SnapshotSesion } from './authStore'
import { cerrarSesion, iniciarSesion, type ResultadoIngreso } from './auth'

export type Rol = 'ADMINISTRADOR' | 'ESTUDIANTE' | 'MEDICO' | 'ENTRENADOR'

export interface Auth extends SnapshotSesion {
  autenticado: boolean
  inicializando: boolean
  /** ¿La sesión tiene alguno de los roles indicados? */
  tieneRol: (...roles: string[]) => boolean
  esAdministrador: boolean
  ingresar: (usuario: string, clave: string, recordar?: boolean) => Promise<ResultadoIngreso>
  salir: () => void
}

export function useAuth(): Auth {
  const snapshot = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getSnapshot,
  )

  const tieneRol = (...roles: string[]) =>
    roles.some((rol) => snapshot.roles.includes(rol))

  return {
    ...snapshot,
    autenticado: snapshot.estado === 'autenticada',
    inicializando: snapshot.estado === 'inicializando',
    tieneRol,
    esAdministrador: snapshot.roles.includes('ADMINISTRADOR'),
    ingresar: iniciarSesion,
    salir: cerrarSesion,
  }
}
