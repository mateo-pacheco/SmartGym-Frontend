import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/api/runtimeEnv', () => ({
  runtimeEnv: { apiUrl: 'https://backend.test', supabaseUrl: 'https://supabase.test', supabaseAnonKey: 'anon' },
}))

import { descargarArchivo, ApiError, setApiToken, clearApiToken } from '../services/api/http'
import { reportes } from '../services/api/reportes'

beforeEach(() => {
  window.sessionStorage.clear()
  window.localStorage.clear()
  const jwt = `${btoa('{}')}.${btoa(JSON.stringify({ sub: 'u', app_metadata: { roles: ['ADMINISTRADOR'] } }))}.s`
  setApiToken(jwt)
  // jsdom no implementa object URLs: se simulan.
  URL.createObjectURL = vi.fn(() => 'blob:mock')
  URL.revokeObjectURL = vi.fn()
})
afterEach(() => {
  clearApiToken()
  vi.restoreAllMocks()
})

describe('descargas de reportes (binario)', () => {
  it('descarga un PDF autenticado y dispara la descarga', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(new Blob([new Uint8Array([37, 80, 68, 70])], { type: 'application/pdf' }), {
        status: 200,
        headers: { 'Content-Type': 'application/pdf' },
      }),
    )
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    await descargarArchivo('/api/v1/accesos-nfc/reportes/pdf', { filename: 'r.pdf' })

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('/api/v1/accesos-nfc/reportes/pdf')
    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect((init.headers as Record<string, string>).Authorization).toMatch(/^Bearer /)
    expect(clickSpy).toHaveBeenCalled()
  })

  it('el módulo de reportes apunta al endpoint de accesos NFC', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(new Blob([new Uint8Array([1])]), { status: 200 }),
    )
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    await reportes.accesosNfcPdf({ deportistaId: 'abc' })
    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('/api/v1/accesos-nfc/reportes/pdf')
    expect(url).toContain('deportistaId=abc')
  })

  it('si el endpoint aún no existe (404), lanza un ApiError con mensaje seguro', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 404 }))
    try {
      await descargarArchivo('/api/v1/accesos-nfc/reportes/pdf', { filename: 'r.pdf' })
      throw new Error('debió lanzar')
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
      expect((e as ApiError).userMessage).toMatch(/no se encontró/i)
    }
  })
})
