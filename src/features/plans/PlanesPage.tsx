import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { useApiData } from '../../services/api/useApiData'
import { gymApprovals, planesNutricionales } from '../../services/api/endpoints'

/* Planes y revisión humana: estado, revisor, versión y siguiente paso.
   La interfaz solo renderiza planes provenientes del backend confirmado. */
export default function PlanesPage() {
  const planes = useApiData(async () => {
    const [nutricionales, aprobaciones] = await Promise.all([
      planesNutricionales.listar(),
      gymApprovals.listar(),
    ])
    return { nutricionales, aprobaciones }
  })
  const filas = [
    ...(planes.datos?.nutricionales ?? []).map((p) => ({
      plan: p.nombre,
      deportista: p.objetivo,
      version: `${p.fechaInicio} → ${p.fechaFin}`,
      revisor: 'Nutrición',
      estado: <StatusBadge tone="success" label="Activo" icon="check" />,
      accion: `${p.caloriasObjetivo} kcal`,
    })),
    ...(planes.datos?.aprobaciones ?? []).map((a) => ({
      plan: `Aprobación ${a.tipoRestriccion}`,
      deportista: a.deportistaId,
      version: `v${a.version}`,
      revisor: a.medicoId,
      estado: <StatusBadge tone={a.estado === 'APROBADO' ? 'success' : 'warning'} label={a.estado} />,
      accion: a.fechaExpiracion ?? 'Sin expiración',
    })),
  ]
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

      <ApiState estado={planes.estado} contract="Planes y revisión humana" error={planes.error} onRetry={planes.recargar} />

      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="sg-section-title">Cola de revisión</h2>
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
            rows={filas}
            emptyState={
              <NoContractState
                illustration="plan"
                title="No hay planes en revisión"
                body="Aprobar, rechazar o pedir cambios dejará registro del revisor y su decisión."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
          <h2 className="sg-section-title">Estados de revisión</h2>
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
          </MotionEffect>
        </div>
      </div>
    </>
  )
}
