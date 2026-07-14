/* Traducción de estados del backend a tono + etiqueta para StatusBadge.
   Tolerante a los valores REALES que devuelve el backend (p. ej. la conexión
   llega como REAL/SIMULADA/INACTIVA), sin asumir un enum cerrado. */

export type Tono = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export interface Visual {
  tono: Tono
  etiqueta: string
}

const CONECTADO = new Set(['REAL', 'CONECTADO', 'ACTIVA', 'ACTIVO', 'DISPONIBLE'])
const INTERMEDIO = new Set([
  'SIMULADA',
  'MANTENIMIENTO',
  'EN_PROCESO',
  'EN_PAUSA',
  'PENDIENTE',
  'DEGRADADO',
])
const INACTIVO = new Set([
  'INACTIVA',
  'DESCONECTADO',
  'ERROR',
  'BLOQUEADA',
  'BLOQUEADA_TEMPORAL',
  'DESACTIVADA',
  'CERRADA',
  'CANCELADA',
  'RECHAZADO',
])

function humanizar(valor: string): string {
  const limpio = valor.replace(/_/g, ' ').toLowerCase()
  return limpio.charAt(0).toUpperCase() + limpio.slice(1)
}

/** Tono según la familia del estado (conectado / intermedio / inactivo). */
export function tonoDeEstado(valor: string | undefined | null): Tono {
  if (!valor) return 'neutral'
  const v = valor.toUpperCase()
  if (CONECTADO.has(v)) return 'success'
  if (INTERMEDIO.has(v)) return 'warning'
  if (INACTIVO.has(v)) return 'danger'
  return 'info'
}

export function estadoVisual(valor: string | undefined | null): Visual {
  return { tono: tonoDeEstado(valor), etiqueta: valor ? humanizar(valor) : '—' }
}

/** ¿El estado de conexión indica un equipo operativo? */
export function estaConectado(valor: string | undefined | null): boolean {
  return !!valor && CONECTADO.has(valor.toUpperCase())
}
