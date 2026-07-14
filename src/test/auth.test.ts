import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/* La sesión depende del entorno (VITE_*). Se fija un backend y Supabase de
   prueba para que login/roles sean deterministas. Los mocks de red viven solo
   aquí; la app real consume el backend. */
vi.mock('../services/api/runtimeEnv', () => ({
  runtimeEnv: {
    apiUrl: 'https://backend.test',
    supabaseUrl: 'https://supabase.test',
    supabaseAnonKey: 'anon-test',
  },
}))

import {
  clearApiToken,
  getApiRoles,
  getApiSubject,
  hasApiToken,
  isTokenExpired,
  setApiToken,
  request,
  ApiError,
} from '../services/api/http'
import { authStore } from '../services/api/authStore'
import { iniciarSesion, haySesion, getRolesSesion, cerrarSesion } from '../services/api/auth'

/** Construye un JWT de prueba (firma irrelevante) con el payload dado. */
function jwt(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${b64({ alg: 'none' })}.${b64(payload)}.sig`
}

const ADMIN_JWT = jwt({ sub: 'user-1', app_metadata: { roles: ['ADMINISTRADOR'] } })
const STUDENT_JWT = jwt({ sub: 'user-2', app_metadata: { roles: ['ESTUDIANTE'] } })

beforeEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
  clearApiToken()
  authStore.limpiarUsuario()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('token y roles', () => {
  it('decodifica el sub y los roles del JWT (app_metadata.roles)', () => {
    setApiToken(ADMIN_JWT)
    expect(getApiSubject()).toBe('user-1')
    expect(getApiRoles()).toEqual(['ADMINISTRADOR'])
    setApiToken(STUDENT_JWT)
    expect(getApiRoles()).toEqual(['ESTUDIANTE'])
  })

  it('marca expiración cuando la fecha ya pasó', () => {
    setApiToken(ADMIN_JWT, false, 'refresh', -10) // expiró hace 10s
    expect(isTokenExpired()).toBe(true)
  })
})

describe('persistencia sessionStorage vs localStorage', () => {
  it('sin «recordar» el token vive solo en sessionStorage', () => {
    setApiToken(ADMIN_JWT, false)
    expect(window.sessionStorage.getItem('smartgym.api.token')).toBe(ADMIN_JWT)
    expect(window.localStorage.getItem('smartgym.api.token')).toBeNull()
  })

  it('con «recordar» el token también persiste en localStorage', () => {
    setApiToken(ADMIN_JWT, true)
    expect(window.localStorage.getItem('smartgym.api.token')).toBe(ADMIN_JWT)
  })
})

describe('manejo de estados HTTP en la capa de transporte', () => {
  it('un 401 cierra la sesión de forma centralizada', async () => {
    setApiToken(ADMIN_JWT)
    expect(hasApiToken()).toBe(true)
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'no auth' }), { status: 401 }),
    )
    await expect(request('/api/x')).rejects.toBeInstanceOf(ApiError)
    expect(hasApiToken()).toBe(false) // el 401 limpió el token
  })

  it('un 403 NO cierra la sesión (falta de permiso, no de autenticación)', async () => {
    setApiToken(ADMIN_JWT)
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'forbidden' }), { status: 403 }),
    )
    await expect(request('/api/x')).rejects.toMatchObject({ status: 403 })
    expect(hasApiToken()).toBe(true) // la sesión sigue válida
  })

  it('mapea el código HTTP a un mensaje seguro para el usuario', async () => {
    setApiToken(ADMIN_JWT)
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 500 }))
    try {
      await request('/api/x')
      throw new Error('debió lanzar')
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
      expect((e as ApiError).userMessage).toMatch(/no está disponible/i)
    }
  })
})

describe('iniciarSesion', () => {
  it('inicia sesión, guarda el usuario y expone los roles', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      // 1) intercambio de credenciales por JWT en Supabase
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: ADMIN_JWT, refresh_token: 'r', expires_in: 3600 }), { status: 200 }),
      )
      // 2) sondeo contra la API (accesosNfc.consultar)
      .mockResolvedValueOnce(new Response(JSON.stringify({ content: [] }), { status: 200 }))

    const resultado = await iniciarSesion('admin@smartgym.app', 'clave', true)
    expect(resultado).toBe('ok')
    expect(haySesion()).toBe(true)
    expect(getRolesSesion()).toEqual(['ADMINISTRADOR'])
    expect(authStore.getSnapshot().usuario).toBe('admin@smartgym.app')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('devuelve «credenciales» cuando Supabase rechaza (400)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('{}', { status: 400 }))
    const resultado = await iniciarSesion('admin@smartgym.app', 'mala')
    expect(resultado).toBe('credenciales')
    expect(haySesion()).toBe(false)
  })

  it('cerrarSesion limpia token y estado', async () => {
    setApiToken(ADMIN_JWT)
    authStore.guardarUsuario('admin@smartgym.app', false)
    expect(haySesion()).toBe(true)
    cerrarSesion()
    expect(haySesion()).toBe(false)
    expect(hasApiToken()).toBe(false)
  })
})

describe('restauración de sesión al cargar', () => {
  it('con un token válido en storage, el store arranca autenticado', async () => {
    window.sessionStorage.setItem('smartgym.api.token', ADMIN_JWT)
    window.sessionStorage.setItem('smartgym.api.user', 'admin@smartgym.app')
    vi.resetModules()
    const store = await import('../services/api/authStore')
    const snap = store.authStore.getSnapshot()
    expect(snap.estado).toBe('autenticada')
    expect(snap.roles).toEqual(['ADMINISTRADOR'])
    expect(snap.usuario).toBe('admin@smartgym.app')
  })
})
