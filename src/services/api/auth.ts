/* Sesión contra la API SmartGym.
   El contrato (openapi.yaml) exige `Authorization: Bearer <JWT>` con un token
   emitido por Supabase. El login intercambia correo/contraseña por ese JWT en
   el endpoint de Supabase Auth y lo valida contra un recurso protegido de la
   API. Token y credenciales viven solo en memoria; jamás en storage. */

import { getApiConfig } from './client'
import { ApiError, clearApiToken, hasApiToken, setApiToken } from './http'
import { accesosNfc } from './endpoints'

export type ResultadoIngreso = 'ok' | 'sin-backend' | 'credenciales' | 'red'

export interface SesionApi {
  usuario: string
}

let sesion: SesionApi | null = null

export function getSesion(): SesionApi | null {
  return sesion
}

export function haySesion(): boolean {
  return sesion !== null && hasApiToken()
}

interface SupabaseConfig {
  url: string
  anonKey: string
}

function getSupabaseConfig(): SupabaseConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!url || !anonKey) return null
  return { url, anonKey }
}

/** Intercambia correo/contraseña por un JWT en Supabase Auth (grant password). */
async function obtenerTokenSupabase(
  config: SupabaseConfig,
  correo: string,
  clave: string,
): Promise<{ token: string } | 'credenciales' | 'red'> {
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
  const data = (await response.json()) as { access_token?: string }
  return data.access_token ? { token: data.access_token } : 'red'
}

/** Inicia sesión: JWT de Supabase + sondeo contra la API SmartGym.
    401 = token rechazado; 403 = autenticado sin permiso sobre el recurso de
    sondeo (la sesión sigue siendo válida para su rol). */
export async function iniciarSesion(usuario: string, clave: string): Promise<ResultadoIngreso> {
  const supabase = getSupabaseConfig()
  if (getApiConfig().status !== 'configurado' || !supabase) {
    return 'sin-backend'
  }

  const resultado = await obtenerTokenSupabase(supabase, usuario, clave)
  if (resultado === 'credenciales' || resultado === 'red') {
    return resultado
  }

  setApiToken(resultado.token)
  try {
    await accesosNfc.consultar({ size: 1 })
    sesion = { usuario }
    return 'ok'
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      sesion = { usuario }
      return 'ok'
    }
    clearApiToken()
    if (error instanceof ApiError && error.status === 401) {
      return 'credenciales'
    }
    return 'red'
  }
}

export function cerrarSesion(): void {
  sesion = null
  clearApiToken()
}
