/* Transporte HTTP del cliente SmartGym.
   Contrato: openapi.yaml (SmartGym API v1.0.0), seguridad Bearer JWT emitido
   por Supabase. El token vive solo en memoria de la sesión; jamás en storage. */

import { getApiConfig } from './client'
import type { ErrorResponseDTO } from './types'
import { runtimeEnv } from './runtimeEnv'

export class ApiError extends Error {
  readonly status: number
  readonly body?: ErrorResponseDTO

  constructor(status: number, body?: ErrorResponseDTO) {
    super(body?.message ?? `Error HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
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

/** Establece el JWT de la sesión (Authorization: Bearer <token>). */
export function setApiToken(
  token: string,
  persist = false,
  refreshToken?: string,
  expiresInSeconds?: number,
): void {
  bearerToken = token
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(SESSION_TOKEN_KEY, token)
  if (persist) window.localStorage.setItem(SESSION_TOKEN_KEY, token)
  else window.localStorage.removeItem(SESSION_TOKEN_KEY)
  if (refreshToken) {
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    if (persist) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
  if (expiresInSeconds) {
    const expiresAt = String(Date.now() + expiresInSeconds * 1000)
    window.sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt)
    if (persist) window.localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt)
  }
}

export function clearApiToken(): void {
  bearerToken = null
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(SESSION_TOKEN_KEY)
  window.localStorage.removeItem(SESSION_TOKEN_KEY)
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  window.sessionStorage.removeItem(TOKEN_EXPIRY_KEY)
  window.localStorage.removeItem(TOKEN_EXPIRY_KEY)
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
  if (!refreshToken || !runtimeEnv.supabaseUrl || !runtimeEnv.supabaseAnonKey) return

  const response = await fetch(`${runtimeEnv.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: runtimeEnv.supabaseAnonKey },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  if (!response.ok) {
    clearApiToken()
    return
  }
  const data = (await response.json()) as {
    access_token: string
    refresh_token: string
    expires_in: number
  }
  const persist = window.localStorage.getItem(SESSION_TOKEN_KEY) !== null
  setApiToken(data.access_token, persist, data.refresh_token, data.expires_in)
}

export function hasApiToken(): boolean {
  return bearerToken !== null
}

/** Identificador estable del usuario autenticado (`sub` del JWT de Supabase). */
export function getApiSubject(): string | null {
  if (!bearerToken) return null
  try {
    const payload = bearerToken.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(atob(normalized)) as { sub?: unknown }
    return typeof decoded.sub === 'string' ? decoded.sub : null
  } catch {
    return null
  }
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
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  await ensureFreshToken()
  const { method = 'GET', query, body } = options
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (bearerToken) headers.Authorization = `Bearer ${bearerToken}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let errorBody: ErrorResponseDTO | undefined
    try {
      errorBody = (await response.json()) as ErrorResponseDTO
    } catch {
      // Respuesta sin cuerpo JSON (403/404 sin detalle): se conserva solo el status.
    }
    throw new ApiError(response.status, errorBody)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
