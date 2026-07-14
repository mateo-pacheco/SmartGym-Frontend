import type { ReactNode } from 'react'
import { EmptyState } from './EmptyState'
import { EmptyIllustration, type IllustrationName } from '../illustrations/EmptyIllustration'

export interface NoContractStateProps {
  illustration: IllustrationName
  /** Título específico del módulo (p. ej. «Aún no hay accesos registrados»). */
  title: string
  /** Una sola línea de contexto sobre por qué está vacío. */
  body: string
  /** Acción primaria real (p. ej. abrir el formulario de creación). */
  action?: ReactNode
}

export function NoContractState({ illustration, title, body, action }: NoContractStateProps) {
  return (
    <EmptyState
      illustration={<EmptyIllustration name={illustration} />}
      title={title}
      body={body}
      actions={action}
    />
  )
}
