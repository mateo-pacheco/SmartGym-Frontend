/* Reportes descargables del backend SmartGym.
   Se mantienen APARTE de endpoints.ts a propósito: devuelven binario (no JSON)
   y aún no forman parte del contrato OpenAPI publicado (103 operaciones). En
   cuanto el backend publique estos endpoints en /v3/api-docs, se moverán al
   contrato. Cada función usa descargarArchivo (token + manejo de errores). */

import { descargarArchivo, type QueryValue } from './http'

/** Filtros del reporte de accesos NFC (mismos que la consulta administrativa). */
export interface FiltroReporteAccesos {
  deportistaId?: string
  maquinaId?: string
  sedeId?: string
  /** ISO-8601 UTC, ej. 2026-07-01T00:00:00Z */
  fechaDesde?: string
  fechaHasta?: string
}

const hoy = () => new Date().toISOString().slice(0, 10)

export const reportes = {
  /**
   * Reporte PDF del historial de accesos NFC.
   * Endpoint del backend: GET /api/v1/accesos-nfc/reportes/pdf
   */
  accesosNfcPdf: (filtro: FiltroReporteAccesos = {}) =>
    descargarArchivo('/api/v1/accesos-nfc/reportes/pdf', {
      filename: `reporte-accesos-nfc-${hoy()}.pdf`,
      query: { ...filtro } as Record<string, QueryValue>,
    }),
}
