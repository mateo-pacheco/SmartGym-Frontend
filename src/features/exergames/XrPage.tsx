import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { useApiData } from '../../services/api/useApiData'
import { exergames } from '../../services/api/endpoints'

/* Exergames XR: la pantalla operativa prioriza preparación, seguridad y
   compatibilidad. Las advertencias médicas nunca quedan ocultas. */
export default function XrPage() {
  const estaciones = useApiData(() => exergames.listarEstaciones())
  const filas = (estaciones.datos ?? []).map((e) => ({
    sesion: e.nombre,
    deportista: 'Estación compartida',
    equipo: e.tipoJuego,
    preparacion: (
      <StatusBadge
        tone={e.estadoConexion === 'CONECTADO' ? 'success' : 'warning'}
        label={e.estadoConexion}
      />
    ),
    rendimiento: 'Disponible para sesiones',
  }))
  return (
    <>
      <PageHeader
        title="Exergames XR"
        lead="Sesiones de realidad mixta con compatibilidad de equipos y criterios de seguridad."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Experiencias' },
          { label: 'Exergames XR' },
        ]}
      />

      <ApiState estado={estaciones.estado} contract="Sesiones XR" error={estaciones.error} onRetry={estaciones.recargar} />

      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="sg-section-title">Sesiones programadas</h2>
          <DataTable
            caption="Sesiones XR programadas con su estado de seguridad"
            columns={[
              { key: 'sesion', header: 'Sesión' },
              { key: 'deportista', header: 'Deportista' },
              { key: 'equipo', header: 'Equipo' },
              { key: 'preparacion', header: 'Preparación' },
              { key: 'rendimiento', header: 'Rendimiento' },
            ]}
            rows={filas}
            emptyState={
              <NoContractState
                illustration="plan"
                title="Aún no hay sesiones XR"
                body="Cada sesión mostrará compatibilidad de equipo, preparación y resultados."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
          <h2 className="sg-section-title">Criterios de preparación</h2>
          <dl className="sg-deflist sg-surface--inset p-3">
            <div>
              <dt>Evaluación médica vigente y equipo verificado</dt>
              <dd><StatusBadge tone="success" label="Apto" /></dd>
            </div>
            <div>
              <dt>Necesita autorización del equipo médico</dt>
              <dd><StatusBadge tone="warning" label="Validación médica" icon="alerta" /></dd>
            </div>
            <div>
              <dt>El equipo no cumple los requisitos XR</dt>
              <dd><StatusBadge tone="neutral" label="No compatible" /></dd>
            </div>
          </dl>
          <p className="sg-note sg-note--muted mt-2">
            Una advertencia médica activa bloquea la sesión hasta ser resuelta; nunca se oculta.
          </p>
          </MotionEffect>
        </div>
      </div>
    </>
  )
}
