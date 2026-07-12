/* Hook de lectura contra la API SmartGym con estados explícitos.
   Nunca inventa datos: sin backend configurado o sin sesión, lo declara. */

import { useCallback, useEffect, useRef, useState } from 'react'
import { getApiConfig } from './client'
import { ApiError } from './http'
import { haySesion } from './auth'

export type EstadoApi = 'sin-backend' | 'sin-sesion' | 'cargando' | 'error' | 'listo'

export interface ApiData<T> {
  estado: EstadoApi
  datos: T | null
  error: string | null
  recargar: () => void
}

interface UseApiDataOptions {
  /** Recursos públicos del contrato pueden leerse sin sesión. */
  requiereSesion?: boolean
}

export function useApiData<T>(
  fetcher: () => Promise<T>,
  { requiereSesion = true }: UseApiDataOptions = {},
): ApiData<T> {
  const configurado = getApiConfig().status === 'configurado'
  const conSesion = haySesion()
  const habilitado = configurado && (!requiereSesion || conSesion)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const [version, setVersion] = useState(0)
  const [estado, setEstado] = useState<EstadoApi>(
    !configurado ? 'sin-backend' : habilitado ? 'cargando' : 'sin-sesion',
  )
  const [datos, setDatos] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!habilitado) return
    let activo = true
    setEstado('cargando')
    setError(null)
    fetcherRef
      .current()
      .then((resultado) => {
        if (!activo) return
        setDatos(resultado)
        setEstado('listo')
      })
      .catch((causa: unknown) => {
        if (!activo) return
        setError(
          causa instanceof ApiError
            ? causa.message
            : 'No se pudo contactar al backend. Revisa la conexión.',
        )
        setEstado('error')
      })
    return () => {
      activo = false
    }
  }, [habilitado, version])

  const recargar = useCallback(() => setVersion((v) => v + 1), [])

  return { estado, datos, error, recargar }
}
