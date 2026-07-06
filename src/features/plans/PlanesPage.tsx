import { PageHeader } from '../../components/navigation/PageHeader'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { StatusBadge } from '../../components/data-display/StatusBadge'

/* Planes y revisión humana: estado, revisor, versión y siguiente paso.
   La interfaz solo renderiza planes provenientes del backend confirmado. */
export default function PlanesPage() {
  return (
    <>
      <PageHeader
        title="Planes y revisiones"
        lead="Planes de entrenamiento y nutrición con su versión, revisor responsable y estado de aprobación."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Atención deportiva' },
          { label: 'Planes y revisiones' },
        ]}
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <DataTable
            caption="Cola de revisión de planes pendientes de decisión humana"
            columns={[
              { key: 'plan', header: 'Plan' },
              { key: 'deportista', header: 'Deportista' },
              { key: 'version', header: 'Versión' },
              { key: 'revisor', header: 'Revisor' },
              { key: 'estado', header: 'Estado' },
              { key: 'accion', header: 'Siguiente paso', align: 'end' },
            ]}
            rows={[]}
            emptyState={
              <NoContractState
                illustration="plan"
                moduleName="La cola de revisión"
                detail="Aprobar, rechazar o pedir cambios dejará trazabilidad del revisor y su decisión."
                contract="Planes y revisión humana"
                expectedAction="aprobar, rechazar o pedir cambios con registro del revisor."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <h2 className="fs-6 fw-semibold mb-3">Estados de revisión</h2>
          <dl className="sg-deflist sg-surface--inset p-3">
            <div>
              <dt>En borrador</dt>
              <dd><StatusBadge tone="neutral" label="Borrador" /></dd>
            </div>
            <div>
              <dt>Esperando revisión humana</dt>
              <dd><StatusBadge tone="info" label="En revisión" icon="reloj" /></dd>
            </div>
            <div>
              <dt>Requiere cambios del autor</dt>
              <dd><StatusBadge tone="warning" label="Con observaciones" /></dd>
            </div>
            <div>
              <dt>Aprobado y activo</dt>
              <dd><StatusBadge tone="success" label="Aprobado" /></dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
