/* Hook para acciones de escritura (POST/PUT/PATCH/DELETE) contra la API.
   Previene el doble envío, normaliza el error a un mensaje seguro y expone el
   estado de envío. No cachea: cada llamada ejecuta la operación real. */

import { useCallback, useRef, useState } from 'react'
import { ApiError } from './http'

export interface MutationState {
  enviando: boolean
  error: string | null
}

export interface UseMutationResult<A extends unknown[], R> extends MutationState {
  ejecutar: (...args: A) => Promise<R | undefined>
  limpiarError: () => void
}

export function useMutation<A extends unknown[], R>(
  accion: (...args: A) => Promise<R>,
): UseMutationResult<A, R> {
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const enVuelo = useRef(false)
  const montado = useRef(true)

  const ejecutar = useCallback(
    async (...args: A): Promise<R | undefined> => {
      // Prevención de doble envío: ignora llamadas mientras una está en curso.
      if (enVuelo.current) return undefined
      enVuelo.current = true
      setEnviando(true)
      setError(null)
      try {
        return await accion(...args)
      } catch (causa) {
        const mensaje =
          causa instanceof ApiError ? causa.userMessage : 'No se pudo completar la operación.'
        if (montado.current) setError(mensaje)
        throw causa
      } finally {
        enVuelo.current = false
        if (montado.current) setEnviando(false)
      }
    },
    [accion],
  )

  const limpiarError = useCallback(() => setError(null), [])

  return { enviando, error, ejecutar, limpiarError }
}
