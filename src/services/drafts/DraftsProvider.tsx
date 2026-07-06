import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  DraftsContext,
  type DeportistaDraft,
  type ManillaDraft,
  type ReservaDraft,
} from './drafts-context'

export function DraftsProvider({ children }: { children: ReactNode }) {
  const [manillas, setManillas] = useState<ManillaDraft[]>([])
  const [reservas, setReservas] = useState<ReservaDraft[]>([])
  const [deportistas, setDeportistas] = useState<DeportistaDraft[]>([])
  const seq = useRef(1)

  const nextId = useCallback((prefix: string) => `${prefix}-local-${seq.current++}`, [])

  const addManilla = useCallback(
    (draft: Omit<ManillaDraft, 'id'>) =>
      setManillas((prev) => [...prev, { ...draft, id: nextId('manilla') }]),
    [nextId],
  )
  const addReserva = useCallback(
    (draft: Omit<ReservaDraft, 'id'>) =>
      setReservas((prev) => [...prev, { ...draft, id: nextId('reserva') }]),
    [nextId],
  )
  const addDeportista = useCallback(
    (draft: Omit<DeportistaDraft, 'id'>) =>
      setDeportistas((prev) => [...prev, { ...draft, id: nextId('deportista') }]),
    [nextId],
  )

  const value = useMemo(
    () => ({ manillas, reservas, deportistas, addManilla, addReserva, addDeportista }),
    [manillas, reservas, deportistas, addManilla, addReserva, addDeportista],
  )

  return <DraftsContext.Provider value={value}>{children}</DraftsContext.Provider>
}
