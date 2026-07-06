import { EmptyState } from './EmptyState'
import { StatusBadge } from '../data-display/StatusBadge'
import { EmptyIllustration, type IllustrationName } from '../illustrations/EmptyIllustration'

export interface NoContractStateProps {
  illustration: IllustrationName
  moduleName: string
  detail: string
  /** Nombre del contrato de backend que activa este módulo (no una URL). */
  contract: string
  /** Acción operativa que se habilitará al confirmarse el contrato. */
  expectedAction: string
}

/* Estado honesto de integración: además de declarar la ausencia de datos,
   explica qué contrato falta y qué acción habilitará (revisión UX #6). */
export function NoContractState({
  illustration,
  moduleName,
  detail,
  contract,
  expectedAction,
}: NoContractStateProps) {
  return (
    <EmptyState
      illustration={<EmptyIllustration name={illustration} />}
      title="Sin datos disponibles"
      body={`${moduleName} se conectará cuando exista un contrato de API confirmado. ${detail}`}
      actions={
        <span className="d-grid gap-2 justify-items-center text-center">
          <StatusBadge tone="warning" label={`Contrato requerido: ${contract}`} icon="reloj" />
          <span className="sg-empty__hint">Al confirmarse: {expectedAction}</span>
        </span>
      }
    />
  )
}
