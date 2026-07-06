import { PageHeader } from '../../components/navigation/PageHeader'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { StatusBadge } from '../../components/data-display/StatusBadge'

/* Alertas médicas: las alertas críticas dominan la jerarquía. Sin motion
   decorativo, sin imágenes, taxonomía de severidad explícita. */
export default function AlertasPage() {
  return (
    <>
      <PageHeader
        title="Alertas médicas"
        lead="Cola de alertas de riesgo con severidad, justificación y flujo de resolución. Una alerta crítica siempre se mantiene visible."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Atención deportiva' },
          { label: 'Alertas médicas' },
        ]}
      />

      <section aria-label="Taxonomía de severidad" className="mb-4">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <StatusBadge tone="danger" label="Crítica · atención inmediata" />
          <StatusBadge tone="warning" label="Moderada · seguimiento" />
          <StatusBadge tone="info" label="Leve · observación" icon="pulso" />
          <StatusBadge tone="success" label="Resuelta" />
        </div>
      </section>

      <DataTable
        caption="Alertas de riesgo médico ordenadas por severidad y antigüedad"
        columns={[
          { key: 'severidad', header: 'Severidad' },
          { key: 'deportista', header: 'Deportista' },
          { key: 'motivo', header: 'Motivo' },
          { key: 'detectada', header: 'Detectada' },
          { key: 'responsable', header: 'Responsable' },
          { key: 'acciones', header: 'Resolución', align: 'end' },
        ]}
        rows={[]}
        emptyState={
          <NoContractState
            illustration="riesgo"
            moduleName="El escalamiento de riesgo"
            detail="Cada alerta mostrará severidad, justificación clínica y su flujo de resolución trazable."
            contract="Riesgo médico"
            expectedAction="atender alertas por severidad y resolverlas con trazabilidad."
          />
        }
      />
    </>
  )
}
