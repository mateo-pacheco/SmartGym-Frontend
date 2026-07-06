import { createContext } from 'react'

/* Borradores locales: registros creados por la persona usuaria en esta sesión,
   siempre etiquetados como "Borrador local". No son datos de producción ni
   simulaciones: existen solo en memoria hasta que el contrato API permita
   sincronizarlos (AGENTS.md §16). */

export interface ManillaDraft {
  id: string
  deportista: string
  programa: string
  identificador: string
}

export interface ReservaDraft {
  id: string
  fecha: string
  franja: string
  zona: string
  deportista: string
}

export interface DeportistaDraft {
  id: string
  nombre: string
  programa: string
}

export interface DraftsContextValue {
  manillas: ManillaDraft[]
  reservas: ReservaDraft[]
  deportistas: DeportistaDraft[]
  addManilla: (draft: Omit<ManillaDraft, 'id'>) => void
  addReserva: (draft: Omit<ReservaDraft, 'id'>) => void
  addDeportista: (draft: Omit<DeportistaDraft, 'id'>) => void
}

export const DraftsContext = createContext<DraftsContextValue | null>(null)
