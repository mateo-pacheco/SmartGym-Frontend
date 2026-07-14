/* Store de sesión reactivo, sin dependencias externas.
   Fuente de verdad del token: http.ts (storage). Este store deriva de ahí un
   snapshot inmutable con el estado de sesión, el usuario y los roles del JWT,
   y notifica a React vía useSyncExternalStore cuando cambia.

   El snapshot se cachea: getSnapshot devuelve la MISMA referencia mientras no
   cambie el token, requisito de useSyncExternalStore para no reciclar. */

import {
  getApiRoles,
  getApiSubject,
  hasApiToken,
  isTokenExpired,
  subscribeAuth,
} from './http'

export type EstadoSesion = 'inicializando' | 'autenticada' | 'anonima'

export interface SnapshotSesion {
  estado: EstadoSesion
  /** Correo del usuario autenticado (o null). */
  usuario: string | null
  /** `sub` del JWT: identificador estable del usuario. */
  id: string | null
  /** Roles de aplicación del JWT (`app_metadata.roles[]`). */
  roles: string[]
}

const USER_KEY = 'smartgym.api.user'

function leerUsuario(): string | null {
  if (typeof window === 'undefined') return null
  return (
    window.sessionStorage.getItem(USER_KEY) ??
    window.localStorage.getItem(USER_KEY)
  )
}

const listeners = new Set<() => void>()

function computar(): SnapshotSesion {
  const activa = hasApiToken() && !isTokenExpired()
  if (!activa) {
    return { estado: 'anonima', usuario: null, id: null, roles: [] }
  }
  return {
    estado: 'autenticada',
    usuario: leerUsuario(),
    id: getApiSubject(),
    roles: getApiRoles(),
  }
}

let snapshot: SnapshotSesion = computar()

function sonIguales(a: SnapshotSesion, b: SnapshotSesion): boolean {
  return (
    a.estado === b.estado &&
    a.usuario === b.usuario &&
    a.id === b.id &&
    a.roles.length === b.roles.length &&
    a.roles.every((r, i) => r === b.roles[i])
  )
}

function recomputar(): void {
  const siguiente = computar()
  if (sonIguales(snapshot, siguiente)) return
  snapshot = siguiente
  for (const listener of listeners) listener()
}

// El store se recalcula ante cualquier cambio de credenciales en http.ts
// (login, refresh, logout, expiración por 401).
subscribeAuth(recomputar)

export const authStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot(): SnapshotSesion {
    return snapshot
  },
  /** Guarda el correo del usuario tras un login exitoso. */
  guardarUsuario(usuario: string, persistir: boolean): void {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(USER_KEY, usuario)
      if (persistir) window.localStorage.setItem(USER_KEY, usuario)
      else window.localStorage.removeItem(USER_KEY)
    }
    recomputar()
  },
  limpiarUsuario(): void {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(USER_KEY)
      window.localStorage.removeItem(USER_KEY)
    }
    recomputar()
  },
  /** Fuerza el recálculo (usado en pruebas y tras restaurar sesión). */
  refrescar: recomputar,
}
