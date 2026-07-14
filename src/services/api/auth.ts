/* Sesión contra la API SmartGym.
   El contrato (openapi.yaml) exige `Authorization: Bearer <JWT>` con un token
   emitido por Supabase. El login intercambia correo/contraseña por ese JWT en
   Supabase Auth y lo valida contra un recurso protegido de la API.

   El estado de sesión (usuario, roles, vigencia) vive en authStore.ts y es
   reactivo; aquí solo se orquestan login/logout. La persistencia del token la
   gobierna http.ts (sessionStorage por defecto; localStorage con «Recordarme»). */

import { getApiConfig } from './client'
import {
  ApiError,
  clearApiToken,
  getApiRoles,
  getApiSubject,
  hasApiToken,
  setApiToken,
} from './http'
import { authStore, type SnapshotSesion } from './authStore'
import { accesosNfc } from './endpoints'
import { runtimeEnv } from './runtimeEnv'

export type ResultadoIngreso = 'ok' | 'sin-backend' | 'credenciales' | 'red'

export interface SesionApi {
  usuario: string
  id: string
}

export function getSesion(): SesionApi | null {
  const s = authStore.getSnapshot()
  return s.estado === 'autenticada' && s.usuario && s.id
    ? { usuario: s.usuario, id: s.id }
    : null
}

export function haySesion(): boolean {
  return authStore.getSnapshot().estado === 'autenticada' && hasApiToken()
}

/** Roles de aplicación de la sesión activa (vacío si no hay sesión). */
export function getRolesSesion(): string[] {
  return authStore.getSnapshot().roles
}

interface SupabaseConfig {
  url: string
  anonKey: string
}

function getSupabaseConfig(): SupabaseConfig | null {
  const url = runtimeEnv.supabaseUrl
  const anonKey = runtimeEnv.supabaseAnonKey
  if (!url || !anonKey) return null
  return { url, anonKey }
}

/** Intercambia correo/contraseña por un JWT en Supabase Auth (grant password). */
async function obtenerTokenSupabase(
  config: SupabaseConfig,
  correo: string,
  clave: string,
): Promise<
  | { token: string; refreshToken?: string; expiresIn?: number }
  | 'credenciales'
  | 'red'
> {
  let response: Response
  try {
    response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: config.anonKey },
      body: JSON.stringify({ email: correo, password: clave }),
    })
  } catch {
    return 'red'
  }
  if (response.status === 400 || response.status === 401 || response.status === 403) {
    return 'credenciales'
  }
  if (!response.ok) return 'red'
  const data = (await response.json()) as {
    access_token?: string
    refresh_token?: string
    expires_in?: number
  }
  return data.access_token
    ? {
        token: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      }
    : 'red'
}

/** Inicia sesión: JWT de Supabase + sondeo contra la API SmartGym.
    401 = token rechazado; 403 = autenticado sin permiso sobre el recurso de
    sondeo (la sesión sigue siendo válida para su rol). */
export async function iniciarSesion(
  usuario: string,
  clave: string,
  recordar = false,
): Promise<ResultadoIngreso> {
  const supabase = getSupabaseConfig()
  if (getApiConfig().status !== 'configurado' || !supabase) {
    return 'sin-backend'
  }

  const resultado = await obtenerTokenSupabase(supabase, usuario, clave)
  if (resultado === 'credenciales' || resultado === 'red') {
    return resultado
  }

  setApiToken(resultado.token, recordar, resultado.refreshToken, resultado.expiresIn)
  const finalizar = () => {
    const id = getApiSubject()
    if (!id) throw new ApiError(401, { message: 'El token no contiene un identificador de usuario.' })
    authStore.guardarUsuario(usuario, recordar)
    return 'ok' as const
  }
  try {
    await accesosNfc.consultar({ size: 1 })
    return finalizar()
  } catch (error) {
    // 403 = sesión válida sin permiso sobre el recurso de sondeo (rol acotado).
    if (error instanceof ApiError && error.status === 403) {
      return finalizar()
    }
    clearApiToken()
    authStore.limpiarUsuario()
    if (error instanceof ApiError && error.status === 401) {
      return 'credenciales'
    }
    return 'red'
  }
}

export function cerrarSesion(): void {
  clearApiToken()
  authStore.limpiarUsuario()
}

/** Re-exporta el snapshot para consumidores que no usan el hook. */
export function snapshotSesion(): SnapshotSesion {
  return authStore.getSnapshot()
}

export { getApiRoles }
