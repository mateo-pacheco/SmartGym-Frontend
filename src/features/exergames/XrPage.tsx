import { PageHeader } from '../../components/navigation/PageHeader'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { StatusBadge } from '../../components/data-display/StatusBadge'

/* Exergames XR: la pantalla operativa prioriza preparación, seguridad y
   compatibilidad. Las advertencias médicas nunca quedan ocultas. */
export default function XrPage() {
  return (
    <>
      <PageHeader
        title="Exergames XR"
        lead="Compatibilidad de equipos, preparación del deportista y sesiones de realidad mixta con sus criterios de seguridad."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Experiencias' },
          { label: 'Exergames XR' },
        ]}
      />

      <section aria-label="Criterios de preparación" className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          <StatusBadge tone="success" label="Apto para sesión XR" />
          <StatusBadge tone="warning" label="Requiere validación médica" icon="alerta" />
          <StatusBadge tone="neutral" label="Equipo no compatible" />
        </div>
      </section>

      <DataTable
        caption="Sesiones XR programadas con su estado de seguridad"
        columns={[
          { key: 'sesion', header: 'Sesión' },
          { key: 'deportista', header: 'Deportista' },
          { key: 'equipo', header: 'Equipo' },
          { key: 'preparacion', header: 'Preparación' },
          { key: 'rendimiento', header: 'Rendimiento' },
        ]}
        rows={[]}
        emptyState={
          <NoContractState
            illustration="plan"
            moduleName="El módulo XR"
            detail="Las sesiones mostrarán compatibilidad de equipo, preparación y resultados."
            contract="Sesiones XR"
            expectedAction="programar sesiones seguras y revisar compatibilidad y rendimiento."
          />
        }
      />
    </>
  )
}
