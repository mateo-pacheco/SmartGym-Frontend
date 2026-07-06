import { useContext } from 'react'
import { DraftsContext, type DraftsContextValue } from './drafts-context'

export function useDrafts(): DraftsContextValue {
  const ctx = useContext(DraftsContext)
  if (!ctx) {
    throw new Error('useDrafts debe usarse dentro de DraftsProvider')
  }
  return ctx
}
