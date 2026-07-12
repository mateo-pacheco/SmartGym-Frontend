import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { useApiData } from '../../services/api/useApiData'
import { riskAlerts } from '../../services/api/endpoints'
import type { AlertLevel, AlertType } from '../../services/api/types'

const SEVERIDAD: Record<AlertLevel, { tone: 'danger' | 'warning' | 'info' | 'neutral'; label: string }> = {
  CRITICO: { tone: 'danger', label: 'Crítica' },
  ALTO: { tone: 'warning', label: 'Alta' },
  MEDIO: { tone: 'info', label: 'Moderada' },
  BAJO: { tone: 'neutral', label: 'Leve' },
}

const TIPO_ALERTA: Record<AlertType, string> = {
  CARDIOVASCULAR: 'Cardiovascular',
  MUSCULOESQUELETICO: 'Musculoesquelético',
  RESPIRATORIO: 'Respiratorio',
  METABOLICO: 'Metabólico',
  NEUROLOGICO: 'Neurológico',
  GENERAL: 'General',
}

/** Ordena por severidad (crítico primero) y luego por detección más reciente. */
const PESO_SEVERIDAD: Record<AlertLevel, number> = { CRITICO: 0, ALTO: 1, MEDIO: 2, BAJO: 3 }

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' })

/* Alertas médicas: las alertas críticas dominan la jerarquía. Sin motion
   decorativo, sin imágenes, taxonomía de severidad explícita. */
export default function AlertasPage() {
  const alertas = useApiData(() => riskAlerts.listar())
  const filas = (alertas.datos ?? [])
    .slice()
    .sort(
      (a, b) =>
        PESO_SEVERIDAD[a.nivelRiesgo] - PESO_SEVERIDAD[b.nivelRiesgo] ||
        b.fechaDeteccion.localeCompare(a.fechaDeteccion),
    )
    .map((alerta) => ({
      severidad: (
        <StatusBadge
          tone={SEVERIDAD[alerta.nivelRiesgo].tone}
          label={SEVERIDAD[alerta.nivelRiesgo].label}
        />
      ),
      deportista: alerta.deportistaId,
      motivo: alerta.descripcion
        ? `${TIPO_ALERTA[alerta.tipoAlerta]} — ${alerta.descripcion}`
        : TIPO_ALERTA[alerta.tipoAlerta],
      detectada: formatearFecha(alerta.fechaDeteccion),
      acciones: alerta.activa ? (
        <StatusBadge tone="warning" label="Activa" icon="reloj" />
      ) : (
        <StatusBadge tone="success" label="Resuelta" icon="check" />
      ),
    }))

  return (
    <>
      <PageHeader
        title="Alertas médicas"
        lead="Cola de alertas de riesgo con severidad, justificación y flujo de resolución."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Atención deportiva' },
          { label: 'Alertas médicas' },
        ]}
      />

      <ApiState
        estado={alertas.estado}
        contract="Riesgo médico"
        error={alertas.error}
        onRetry={alertas.recargar}
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="sg-section-title">Cola de alertas</h2>
          <DataTable
            caption="Alertas de riesgo médico ordenadas por severidad y antigüedad"
            columns={[
              { key: 'severidad', header: 'Severidad' },
              { key: 'deportista', header: 'Deportista' },
              { key: 'motivo', header: 'Motivo' },
              { key: 'detectada', header: 'Detectada' },
              { key: 'acciones', header: 'Resolución', align: 'end' },
            ]}
            rows={filas}
            emptyState={
              <NoContractState
                illustration="riesgo"
                title="Sin alertas activas"
                body="Las alertas se ordenarán por severidad y cada una registrará su resolución."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
          <h2 className="sg-section-title">Niveles de severidad</h2>
          <dl className="sg-deflist sg-surface--inset p-3">
            <div>
              <dt>Atención inmediata; permanece visible</dt>
              <dd><StatusBadge tone="danger" label="Crítica" /></dd>
            </div>
            <div>
              <dt>Requiere seguimiento programado</dt>
              <dd><StatusBadge tone="warning" label="Moderada" /></dd>
            </div>
            <div>
              <dt>Bajo riesgo, en observación</dt>
              <dd><StatusBadge tone="info" label="Leve" icon="pulso" /></dd>
            </div>
            <div>
              <dt>Cerrada con resolución trazable</dt>
              <dd><StatusBadge tone="success" label="Resuelta" /></dd>
            </div>
          </dl>
          <p className="sg-note sg-note--muted mt-2">
            Una alerta crítica nunca se oculta: se mantiene en pantalla hasta que un responsable
            la resuelve.
          </p>
          </MotionEffect>
        </div>
      </div>
    </>
  )
}
