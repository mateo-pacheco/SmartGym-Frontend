/* Hook de lectura contra la API SmartGym con estados explícitos.
   Nunca inventa datos: sin backend configurado o sin sesión, lo declara.
   Cancela la petición en curso al desmontar o al recargar (AbortController) y
   nunca actualiza estado después del desmontaje. */

import { useCallback, useEffect, useRef, useState } from 'react'
import { getApiConfig } from './client'
import { ApiError } from './http'
import { useAuth } from './useAuth'

export type EstadoApi =
  | 'sin-backend'
  | 'sin-sesion'
  | 'sesion-expirada'
  | 'sin-permiso'
  | 'cargando'
  | 'error'
  | 'listo'

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
  fetcher: (signal: AbortSignal) => Promise<T>,
  { requiereSesion = true }: UseApiDataOptions = {},
): ApiData<T> {
  const configurado = getApiConfig().status === 'configurado'
  const { autenticado } = useAuth()
  const habilitado = configurado && (!requiereSesion || autenticado)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const [version, setVersion] = useState(0)
  const [estado, setEstado] = useState<EstadoApi>(
    !configurado ? 'sin-backend' : habilitado ? 'cargando' : 'sin-sesion',
  )
  const [datos, setDatos] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!configurado) {
      setEstado('sin-backend')
      return
    }
    if (!habilitado) {
      setEstado('sin-sesion')
      return
    }

    const controller = new AbortController()
    let activo = true
    setEstado('cargando')
    setError(null)
    fetcherRef
      .current(controller.signal)
      .then((resultado) => {
        if (!activo) return
        setDatos(resultado)
        setEstado('listo')
      })
      .catch((causa: unknown) => {
        if (!activo || controller.signal.aborted) return
        if (causa instanceof DOMException && causa.name === 'AbortError') return
        if (causa instanceof ApiError && causa.status === 403) {
          setError(null)
          setEstado('sin-permiso')
          return
        }
        if (causa instanceof ApiError && causa.status === 401) {
          // El 401 ya cerró la sesión en http.ts; la guarda redirige.
          setError(null)
          setEstado('sesion-expirada')
          return
        }
        setError(causa instanceof ApiError ? causa.userMessage : 'No se pudo contactar al backend.')
        setEstado('error')
      })
    return () => {
      activo = false
      controller.abort()
    }
  }, [configurado, habilitado, version])

  const recargar = useCallback(() => setVersion((v) => v + 1), [])

  return { estado, datos, error, recargar }
}
