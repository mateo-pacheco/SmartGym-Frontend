/* Transporte HTTP del cliente SmartGym.
   Contrato: openapi.yaml (SmartGym API v1.0.0), seguridad Bearer JWT emitido
   por Supabase.

   Persistencia del token (decisión documentada):
   - Por defecto el token vive en `sessionStorage`: se borra al cerrar la
     pestaña, minimizando la ventana de exposición.
   - Solo si el usuario marca «Recordarme» se copia además a `localStorage`
     para sobrevivir al cierre del navegador.
   El refresh token sigue la misma regla que el access token. Nunca se
   registran token ni credenciales en consola. */

import { getApiConfig } from './client'
import type { ErrorResponseDTO } from './types'
import { runtimeEnv } from './runtimeEnv'

/** Mensaje apto para el usuario según el código HTTP, sin filtrar detalles
    internos del backend. Para validaciones (400/409/422) se prefiere el
    mensaje del backend si viene, por ser accionable. */
export function mensajeDeEstado(status: number, body?: ErrorResponseDTO): string {
  const delBackend = body?.message?.trim()
  switch (status) {
    case 0:
      return 'No se pudo contactar al backend. Revisa tu conexión.'
    case 400:
      return delBackend || 'La solicitud contiene datos inválidos.'
    case 401:
      return 'Tu sesión expiró. Inicia sesión nuevamente.'
    case 403:
      return 'No tienes permisos para realizar esta acción.'
    case 404:
      return 'No se encontró el recurso solicitado.'
    case 409:
      return delBackend || 'La operación entra en conflicto con el estado actual.'
    case 422:
      return delBackend || 'Los datos enviados no son válidos.'
    case 429:
      return 'Demasiadas solicitudes. Espera unos segundos e inténtalo de nuevo.'
    case 500:
    case 502:
    case 503:
    case 504:
      return 'El servidor no está disponible por el momento. Inténtalo más tarde.'
    default:
      return delBackend || `El backend respondió con un error (${status}).`
  }
}

export class ApiError extends Error {
  readonly status: number
  readonly body?: ErrorResponseDTO

  constructor(status: number, body?: ErrorResponseDTO) {
    super(body?.message ?? `Error HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }

  /** Mensaje seguro para mostrar en la interfaz. */
  get userMessage(): string {
    return mensajeDeEstado(this.status, this.body)
  }
}

const SESSION_TOKEN_KEY = 'smartgym.api.token'
const REFRESH_TOKEN_KEY = 'smartgym.api.refresh-token'
const TOKEN_EXPIRY_KEY = 'smartgym.api.expires-at'

function readStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(SESSION_TOKEN_KEY) ?? window.localStorage.getItem(SESSION_TOKEN_KEY)
}

let bearerToken: string | null = readStoredToken()

// --- Suscripción reactiva a cambios de credenciales -----------------------
// El store de sesión (authStore.ts) se suscribe aquí para recomputar su
// snapshot cuando el token cambia (login, refresh, logout, expiración).
type AuthListener = () => void
const authListeners = new Set<AuthListener>()

export function subscribeAuth(listener: AuthListener): () => void {
  authListeners.add(listener)
  return () => authListeners.delete(listener)
}

function notifyAuthChange(): void {
  for (const listener of authListeners) listener()
}

/** Establece el JWT de la sesión (Authorization: Bearer <token>). */
export function setApiToken(
  token: string,
  persist = false,
  refreshToken?: string,
  expiresInSeconds?: number,
): void {
  bearerToken = token
  if (typeof window === 'undefined') {
    notifyAuthChange()
    return
  }
  window.sessionStorage.setItem(SESSION_TOKEN_KEY, token)
  if (persist) window.localStorage.setItem(SESSION_TOKEN_KEY, token)
  else window.localStorage.removeItem(SESSION_TOKEN_KEY)
  if (refreshToken) {
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    if (persist) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    else window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
  if (expiresInSeconds) {
    const expiresAt = String(Date.now() + expiresInSeconds * 1000)
    window.sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt)
    if (persist) window.localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt)
    else window.localStorage.removeItem(TOKEN_EXPIRY_KEY)
  }
  notifyAuthChange()
}

export function clearApiToken(): void {
  bearerToken = null
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(SESSION_TOKEN_KEY)
    window.localStorage.removeItem(SESSION_TOKEN_KEY)
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    window.localStorage.removeItem(REFRESH_TOKEN_KEY)
    window.sessionStorage.removeItem(TOKEN_EXPIRY_KEY)
    window.localStorage.removeItem(TOKEN_EXPIRY_KEY)
  }
  notifyAuthChange()
}

/** ¿La sesión se guardó con «Recordarme» (persiste en localStorage)? */
export function isPersistentSession(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(SESSION_TOKEN_KEY) !== null
}

async function ensureFreshToken(): Promise<void> {
  if (typeof window === 'undefined' || !bearerToken) return
  const expiresAt = Number(
    window.sessionStorage.getItem(TOKEN_EXPIRY_KEY) ??
      window.localStorage.getItem(TOKEN_EXPIRY_KEY) ??
      0,
  )
  if (!expiresAt || expiresAt - Date.now() > 60_000) return
  const refreshToken =
    window.sessionStorage.getItem(REFRESH_TOKEN_KEY) ??
    window.localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refreshToken || !runtimeEnv.supabaseUrl || !runtimeEnv.supabaseAnonKey) {
    // Sin forma de renovar: la sesión es inconsistente, se cierra limpiamente.
    clearApiToken()
    return
  }

  let response: Response
  try {
    response = await fetch(`${runtimeEnv.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: runtimeEnv.supabaseAnonKey },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  } catch {
    // Fallo de red al renovar: no destruimos la sesión por un corte puntual;
    // la petición seguirá con el token vigente y, si ya expiró, dará 401.
    return
  }
  if (!response.ok) {
    clearApiToken()
    return
  }
  const data = (await response.json()) as {
    access_token: string
    refresh_token: string
    expires_in: number
  }
  setApiToken(data.access_token, isPersistentSession(), data.refresh_token, data.expires_in)
}

export function hasApiToken(): boolean {
  return bearerToken !== null
}

interface JwtPayload {
  sub?: unknown
  app_metadata?: { roles?: unknown; role?: unknown }
  user_metadata?: Record<string, unknown>
  exp?: unknown
}

function decodeJwt(): JwtPayload | null {
  if (!bearerToken) return null
  try {
    const payload = bearerToken.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(normalized)) as JwtPayload
  } catch {
    return null
  }
}

/** Identificador estable del usuario autenticado (`sub` del JWT de Supabase). */
export function getApiSubject(): string | null {
  const decoded = decodeJwt()
  return typeof decoded?.sub === 'string' ? decoded.sub : null
}

/** Roles de aplicación del usuario (`app_metadata.roles[]` del JWT emitido por
    Supabase). Ej.: ['ADMINISTRADOR'], ['ESTUDIANTE']. */
export function getApiRoles(): string[] {
  const meta = decodeJwt()?.app_metadata
  if (!meta) return []
  if (Array.isArray(meta.roles)) {
    return meta.roles.filter((r): r is string => typeof r === 'string')
  }
  if (typeof meta.role === 'string') return [meta.role]
  return []
}

/** ¿El token guardado ya expiró según su marca de expiración local? */
export function isTokenExpired(): boolean {
  if (typeof window === 'undefined' || !bearerToken) return false
  const expiresAt = Number(
    window.sessionStorage.getItem(TOKEN_EXPIRY_KEY) ??
      window.localStorage.getItem(TOKEN_EXPIRY_KEY) ??
      0,
  )
  return expiresAt > 0 && expiresAt <= Date.now()
}

export type QueryValue = string | number | boolean | undefined

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const config = getApiConfig()
  if (config.status !== 'configurado' || !config.baseUrl) {
    throw new ApiError(0, {
      message:
        'Backend no configurado: define VITE_SMARTGYM_API_URL para conectar con la API SmartGym.',
    })
  }
  const url = new URL(path, config.baseUrl)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  query?: Record<string, QueryValue>
  body?: unknown
  /** Permite cancelar la petición (p. ej. al desmontar el componente). */
  signal?: AbortSignal
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  await ensureFreshToken()
  const { method = 'GET', query, body, signal } = options
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (bearerToken) headers.Authorization = `Bearer ${bearerToken}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let response: Response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    // Fallo de red / CORS / DNS: se normaliza a un ApiError de estado 0.
    throw new ApiError(0)
  }

  if (!response.ok) {
    let errorBody: ErrorResponseDTO | undefined
    try {
      errorBody = (await response.json()) as ErrorResponseDTO
    } catch {
      // Respuesta sin cuerpo JSON (403/404 sin detalle): se conserva solo el status.
    }
    // Un 401 significa token inválido o expirado: se cierra la sesión de forma
    // centralizada para que la UI reaccione (redirección a /ingresar).
    if (response.status === 401) clearApiToken()
    throw new ApiError(response.status, errorBody)
  }

  if (response.status === 204) return undefined as T
  const texto = await response.text()
  if (!texto) return undefined as T
  return JSON.parse(texto) as T
}

export interface DescargaOptions {
  /** Nombre de archivo por defecto si el servidor no envía Content-Disposition. */
  filename: string
  query?: Record<string, QueryValue>
  signal?: AbortSignal
  accept?: string
}

/** Nombre de archivo desde la cabecera Content-Disposition, si viene. */
function nombreDesdeCabecera(cabecera: string | null): string | null {
  if (!cabecera) return null
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(cabecera)
  if (utf8?.[1]) return decodeURIComponent(utf8[1])
  const simple = /filename="?([^";]+)"?/i.exec(cabecera)
  return simple?.[1] ?? null
}

/**
 * Descarga un archivo binario autenticado (PDF, Excel, etc.) y dispara la
 * descarga en el navegador. Reutiliza el token y el mapeo de errores del
 * transporte JSON, pero maneja el cuerpo como Blob (no como JSON).
 * Preparado para los reportes que expone el backend (p. ej.
 * `GET /api/v1/accesos-nfc/reportes/pdf`).
 */
export async function descargarArchivo(path: string, options: DescargaOptions): Promise<void> {
  await ensureFreshToken()
  const { filename, query, signal, accept = 'application/pdf, application/octet-stream' } = options
  const headers: Record<string, string> = { Accept: accept }
  if (bearerToken) headers.Authorization = `Bearer ${bearerToken}`

  let response: Response
  try {
    response = await fetch(buildUrl(path, query), { method: 'GET', headers, signal })
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0)
  }

  if (!response.ok) {
    let errorBody: ErrorResponseDTO | undefined
    try {
      errorBody = (await response.json()) as ErrorResponseDTO
    } catch {
      /* respuesta sin cuerpo JSON */
    }
    if (response.status === 401) clearApiToken()
    throw new ApiError(response.status, errorBody)
  }

  const blob = await response.blob()
  if (typeof window === 'undefined') return
  const nombre = nombreDesdeCabecera(response.headers.get('Content-Disposition')) ?? filename
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  URL.revokeObjectURL(url)
}
