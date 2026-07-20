import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { CrudSection } from '../../components/data-display/CrudSection'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { UUID_RE, UUID_MSG } from '../../lib/validaciones'
import { useApiData } from '../../services/api/useApiData'
import { useAuth } from '../../services/api/useAuth'
import { riskAlerts } from '../../services/api/endpoints'
import { estadoVisual } from '../../lib/estadoVisual'
import { NIVEL_RIESGO, TIPO_RESTRICCION } from '../../lib/opcionesContrato'
import type { AlertLevel, RiskAlertRequest, RiskAlertResponse } from '../../services/api/types'

const SI_NO = [{ value: 'true', label: 'Sí' }, { value: 'false', label: 'No' }]
const PESO: Record<string, number> = { CRITICO: 0, ALTO: 1, MEDIO: 2, BAJO: 3 }
const fecha = (iso: string) => new Date(iso).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' })

const toneNivel = (nivel: string): 'danger' | 'warning' | 'info' | 'neutral' => {
  const map: Record<AlertLevel, 'danger' | 'warning' | 'info' | 'neutral'> = {
    CRITICO: 'danger', ALTO: 'warning', MEDIO: 'info', BAJO: 'neutral',
  }
  return map[nivel as AlertLevel] ?? 'info'
}

export default function AlertasPage() {
  const { esAdministrador } = useAuth()
  const alertas = useApiData(() => riskAlerts.listar())

  const ordenadas = {
    ...alertas,
    datos: (alertas.datos ?? []).slice().sort(
      (a, b) => (PESO[a.nivelRiesgo] ?? 9) - (PESO[b.nivelRiesgo] ?? 9) || b.fechaDeteccion.localeCompare(a.fechaDeteccion),
    ),
  }

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

      <div className="row g-4">
        <div className="col-lg-8">
          <CrudSection<RiskAlertResponse>
            titulo="Cola de alertas"
            entidad="Alerta"
            datos={ordenadas}
            puedeGestionar={esAdministrador}
            illustration="riesgo"
            emptyTitle="Sin alertas registradas"
            emptyBody="Las alertas se ordenan por severidad y registran su resolución."
            idDe={(a) => a.id}
            columnas={[
              { key: 'severidad', header: 'Severidad' },
              { key: 'deportista', header: 'Deportista' },
              { key: 'motivo', header: 'Motivo' },
              { key: 'detectada', header: 'Detectada' },
              { key: 'estado', header: 'Estado' },
            ]}
            fila={(a) => ({
              severidad: <StatusBadge tone={toneNivel(a.nivelRiesgo)} label={estadoVisual(a.nivelRiesgo).etiqueta} />,
              deportista: a.deportistaId,
              motivo: a.descripcion ? `${estadoVisual(a.tipoAlerta).etiqueta} — ${a.descripcion}` : estadoVisual(a.tipoAlerta).etiqueta,
              detectada: fecha(a.fechaDeteccion),
              estado: a.activa
                ? <StatusBadge tone="warning" label="Activa" icon="reloj" />
                : <StatusBadge tone="success" label="Resuelta" icon="check" />,
            })}
            campos={[
              { key: 'deportistaId', label: 'Deportista (UUID)', tipo: 'text', requerido: true, patron: UUID_RE, mensajeInvalido: UUID_MSG, ayuda: 'Pega el UUID del deportista desde un registro existente.' },
              { key: 'tipoAlerta', label: 'Tipo de alerta', tipo: 'select', requerido: true, opciones: TIPO_RESTRICCION, ancho: 'half' },
              { key: 'nivelRiesgo', label: 'Nivel de riesgo', tipo: 'select', requerido: true, opciones: NIVEL_RIESGO, ancho: 'half' },
              { key: 'rpe', label: 'RPE (0-10)', tipo: 'number', min: 0, max: 10, ancho: 'half' },
              { key: 'activa', label: 'Activa', tipo: 'select', opciones: SI_NO, ancho: 'half', ayuda: 'Marca «No» para resolver la alerta.' },
              { key: 'descripcion', label: 'Descripción', tipo: 'textarea' },
            ]}
            aValores={(a) => ({ deportistaId: a.deportistaId, tipoAlerta: a.tipoAlerta, nivelRiesgo: a.nivelRiesgo, rpe: a.rpe != null ? String(a.rpe) : '', activa: String(a.activa), descripcion: a.descripcion ?? '' })}
            crear={(v) => riskAlerts.crear(alertaBody(v))}
            actualizar={(id, v) => riskAlerts.actualizar(id, alertaBody(v))}
            eliminar={(id) => riskAlerts.eliminar(id)}
            reporte={{ pdf: riskAlerts.reportePdf, excel: riskAlerts.reporteExcel }}
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
            <h2 className="sg-section-title">Niveles de severidad</h2>
            <dl className="sg-deflist sg-surface--inset p-3">
              <div><dt>Atención inmediata; permanece visible</dt><dd><StatusBadge tone="danger" label="Crítico" /></dd></div>
              <div><dt>Requiere seguimiento programado</dt><dd><StatusBadge tone="warning" label="Alto" /></dd></div>
              <div><dt>Bajo riesgo, en observación</dt><dd><StatusBadge tone="info" label="Medio" icon="pulso" /></dd></div>
              <div><dt>Cerrada con resolución trazable</dt><dd><StatusBadge tone="success" label="Resuelta" /></dd></div>
            </dl>
            <p className="sg-note sg-note--muted mt-2">
              Una alerta crítica nunca se oculta: permanece hasta que un responsable la resuelve.
            </p>
          </MotionEffect>
        </div>
      </div>
    </>
  )
}

function alertaBody(v: Record<string, string>): RiskAlertRequest {
  return {
    deportistaId: v.deportistaId,
    tipoAlerta: v.tipoAlerta as RiskAlertRequest['tipoAlerta'],
    nivelRiesgo: v.nivelRiesgo as RiskAlertRequest['nivelRiesgo'],
    descripcion: v.descripcion || undefined,
    rpe: v.rpe ? Number(v.rpe) : undefined,
    activa: v.activa ? v.activa === 'true' : undefined,
  }
}
