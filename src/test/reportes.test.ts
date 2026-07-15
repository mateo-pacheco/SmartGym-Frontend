import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/api/runtimeEnv', () => ({
  runtimeEnv: { apiUrl: 'https://backend.test', supabaseUrl: 'https://supabase.test', supabaseAnonKey: 'anon' },
}))

import { descargarArchivo, ApiError, setApiToken, clearApiToken } from '../services/api/http'
import { accesosNfc, alimentos, agendamiento, managementAnalytics } from '../services/api/endpoints'

const okBlob = (tipo = 'application/pdf') =>
  new Response(new Blob([new Uint8Array([37, 80, 68, 70])], { type: tipo }), {
    status: 200,
    headers: { 'Content-Type': tipo },
  })

beforeEach(() => {
  window.sessionStorage.clear()
  window.localStorage.clear()
  const jwt = `${btoa('{}')}.${btoa(JSON.stringify({ sub: 'u', app_metadata: { roles: ['ADMINISTRADOR'] } }))}.s`
  setApiToken(jwt)
  // jsdom no implementa object URLs ni descargas reales: se simulan.
  URL.createObjectURL = vi.fn(() => 'blob:mock')
  URL.revokeObjectURL = vi.fn()
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
})
afterEach(() => {
  clearApiToken()
  vi.restoreAllMocks()
})

describe('reportes descargables (PDF/Excel)', () => {
  it('descarga un PDF autenticado y dispara la descarga en el navegador', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okBlob())
    await accesosNfc.reporteAccesosPdf()

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('/api/v1/accesos-nfc/reportes/pdf')
    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect((init.headers as Record<string, string>).Authorization).toMatch(/^Bearer /)
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  it('el reporte Excel pide el MIME de hoja de cálculo', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okBlob('application/vnd.ms-excel'))
    await alimentos.reporteExcel()

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('/api/alimentos/reportes/excel')
    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect((init.headers as Record<string, string>).Accept).toContain('spreadsheetml.sheet')
  })

  it('el reporte de slots envía los parámetros obligatorios del contrato', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okBlob())
    await agendamiento.reporteSlotsPdf('espacio-1', '2026-07-15')

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('/api/agendamiento/slots/reportes/pdf')
    expect(url).toContain('espacio=espacio-1')
    expect(url).toContain('fecha=2026-07-15')
  })

  it('el reporte de gestión envía el rango de fechas', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okBlob())
    await managementAnalytics.reportePdf('2026-06-01', '2026-07-15')

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('/api/v1/management-analytics/dashboard/reportes/pdf')
    expect(url).toContain('startDate=2026-06-01')
    expect(url).toContain('endDate=2026-07-15')
  })

  it('usa el nombre de archivo del Content-Disposition cuando el backend lo envía', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(new Blob([new Uint8Array([1])]), {
        status: 200,
        headers: { 'Content-Disposition': 'attachment; filename="accesos-julio.pdf"' },
      }),
    )
    const setDownload = vi.spyOn(HTMLAnchorElement.prototype, 'download', 'set')
    await accesosNfc.reporteAccesosPdf()
    expect(setDownload).toHaveBeenCalledWith('accesos-julio.pdf')
  })

  it('un error del backend se traduce a un mensaje seguro y no descarga nada', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 403 }))
    await expect(descargarArchivo('/api/alimentos/reportes/pdf', { filename: 'r.pdf' })).rejects.toMatchObject({
      status: 403,
    })
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })

  it('un 404 (reporte inexistente) expone el mensaje mapeado', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 404 }))
    try {
      await descargarArchivo('/api/alimentos/reportes/pdf', { filename: 'r.pdf' })
      throw new Error('debió lanzar')
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
      expect((e as ApiError).userMessage).toMatch(/no se encontró/i)
    }
  })
})
