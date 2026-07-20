import { PageHeader } from '../../components/navigation/PageHeader'
import { Tabs } from '../../components/navigation/Tabs'
import { CrudSection } from '../../components/data-display/CrudSection'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { useApiData } from '../../services/api/useApiData'
import { useAuth } from '../../services/api/useAuth'
import { clinicalEvaluations, medicalRestrictions } from '../../services/api/endpoints'
import { estadoVisual } from '../../lib/estadoVisual'
import { RESTRICTION_TYPE } from '../../lib/opcionesContrato'
import { UUID_RE, UUID_MSG } from '../../lib/validaciones'
import type {
  ClinicalEvaluationRequest,
  ClinicalEvaluationResponse,
  MedicalRestrictionRequest,
  MedicalRestrictionResponse,
} from '../../services/api/types'

const SI_NO = [{ value: 'true', label: 'Sí' }, { value: 'false', label: 'No' }]
const fechaCorta = (iso: string) => new Date(iso).toLocaleDateString('es-EC')
const aIsoFecha = (v: string) => (v ? new Date(v).toISOString() : undefined)

/* Expediente clínico: evaluaciones y restricciones médicas del deportista,
   con datos reales del backend. Solo roles autorizados pueden gestionar. */
export default function DeportistasPage() {
  const { esAdministrador, id: sesionId } = useAuth()
  const evaluaciones = useApiData(() => clinicalEvaluations.listar())
  const restricciones = useApiData(() => medicalRestrictions.listar())

  const evaluacionesTab = (
    <CrudSection<ClinicalEvaluationResponse>
      titulo="Evaluaciones clínicas"
      entidad="Evaluación"
      datos={evaluaciones}
      puedeGestionar={esAdministrador}
      illustration="riesgo"
      emptyTitle="Sin evaluaciones registradas"
      emptyBody="Registra una evaluación clínica con diagnóstico y RPE."
      idDe={(e) => e.id}
      columnas={[
        { key: 'deportista', header: 'Deportista' },
        { key: 'diagnostico', header: 'Diagnóstico' },
        { key: 'fecha', header: 'Fecha' },
        { key: 'rpe', header: 'RPE', align: 'end' },
      ]}
      fila={(e) => ({
        deportista: e.deportistaId,
        diagnostico: e.diagnostico,
        fecha: fechaCorta(e.fechaEvaluacion),
        rpe: <StatusBadge tone="info" label={`RPE ${e.rpe ?? '—'}`} icon="pulso" />,
      })}
      campos={[
        { key: 'deportistaId', label: 'Deportista (UUID)', tipo: 'text', requerido: true, ancho: 'half', patron: UUID_RE, mensajeInvalido: UUID_MSG, ayuda: 'Pega el UUID del deportista desde un registro existente.' },
        { key: 'profesionalId', label: 'Profesional (UUID)', tipo: 'text', requerido: true, ancho: 'half', patron: UUID_RE, mensajeInvalido: UUID_MSG, valorPorDefecto: sesionId ?? '', ayuda: 'Por defecto, tu propio usuario.' },
        { key: 'diagnostico', label: 'Diagnóstico', tipo: 'text', requerido: true },
        { key: 'rpe', label: 'RPE (0-10)', tipo: 'number', min: 0, max: 10, ancho: 'half' },
        { key: 'observaciones', label: 'Observaciones', tipo: 'textarea' },
      ]}
      aValores={(e) => ({ deportistaId: e.deportistaId, profesionalId: e.profesionalId, diagnostico: e.diagnostico, rpe: e.rpe != null ? String(e.rpe) : '', observaciones: e.observaciones ?? '' })}
      crear={(v) => clinicalEvaluations.crear(evalBody(v))}
      actualizar={(id, v) => clinicalEvaluations.actualizar(id, evalBody(v))}
      eliminar={(id) => clinicalEvaluations.eliminar(id)}
      reporte={{ pdf: clinicalEvaluations.reportePdf, excel: clinicalEvaluations.reporteExcel }}
    />
  )

  const restriccionesTab = (
    <CrudSection<MedicalRestrictionResponse>
      titulo="Restricciones médicas"
      entidad="Restricción"
      datos={restricciones}
      puedeGestionar={esAdministrador}
      illustration="riesgo"
      emptyTitle="Sin restricciones registradas"
      emptyBody="Registra una restricción médica vinculada a una evaluación."
      idDe={(r) => r.id}
      columnas={[
        { key: 'deportista', header: 'Deportista' },
        { key: 'tipo', header: 'Tipo' },
        { key: 'descripcion', header: 'Descripción' },
        { key: 'vigencia', header: 'Vigencia' },
        { key: 'activa', header: 'Activa' },
      ]}
      fila={(r) => ({
        deportista: r.deportistaId,
        tipo: estadoVisual(r.restrictionType).etiqueta,
        descripcion: r.descripcion,
        vigencia: `${fechaCorta(r.fechaInicio)}${r.fechaFin ? ' → ' + fechaCorta(r.fechaFin) : ''}`,
        activa: <StatusBadge tone={r.activa ? 'warning' : 'neutral'} label={r.activa ? 'Activa' : 'Inactiva'} />,
      })}
      campos={[
        { key: 'deportistaId', label: 'Deportista (UUID)', tipo: 'text', requerido: true, ancho: 'half', patron: UUID_RE, mensajeInvalido: UUID_MSG, ayuda: 'Pega el UUID del deportista desde un registro existente.' },
        { key: 'clinicalEvaluationId', label: 'Evaluación', tipo: 'select', requerido: true, opciones: (evaluaciones.datos ?? []).map((e) => ({ value: e.id, label: `${e.diagnostico} · ${fechaCorta(e.fechaEvaluacion)}` })) },
        { key: 'restrictionType', label: 'Tipo', tipo: 'select', requerido: true, opciones: RESTRICTION_TYPE, ancho: 'half' },
        { key: 'activa', label: 'Activa', tipo: 'select', opciones: SI_NO, ancho: 'half' },
        { key: 'descripcion', label: 'Descripción', tipo: 'textarea', requerido: true },
        { key: 'fechaInicio', label: 'Fecha inicio', tipo: 'date', requerido: true, ancho: 'half' },
        { key: 'fechaFin', label: 'Fecha fin', tipo: 'date', ancho: 'half' },
      ]}
      aValores={(r) => ({ deportistaId: r.deportistaId, clinicalEvaluationId: r.clinicalEvaluationId, restrictionType: r.restrictionType, activa: String(r.activa), descripcion: r.descripcion, fechaInicio: r.fechaInicio.slice(0, 10), fechaFin: r.fechaFin ? r.fechaFin.slice(0, 10) : '' })}
      crear={(v) => medicalRestrictions.crear(restriccionBody(v))}
      actualizar={(id, v) => medicalRestrictions.actualizar(id, restriccionBody(v))}
      eliminar={(id) => medicalRestrictions.eliminar(id)}
      reporte={{ pdf: medicalRestrictions.reportePdf, excel: medicalRestrictions.reporteExcel }}
    />
  )

  return (
    <>
      <PageHeader
        title="Deportistas"
        lead="Expediente clínico: evaluaciones y restricciones médicas. La información clínica se muestra solo a roles autorizados."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Atención deportiva' },
          { label: 'Deportistas' },
        ]}
      />
      <Tabs
        tabs={[
          { id: 'evaluaciones', label: 'Evaluaciones', content: evaluacionesTab },
          { id: 'restricciones', label: 'Restricciones médicas', content: restriccionesTab },
        ]}
      />
    </>
  )
}

function evalBody(v: Record<string, string>): ClinicalEvaluationRequest {
  return {
    deportistaId: v.deportistaId,
    profesionalId: v.profesionalId,
    diagnostico: v.diagnostico,
    observaciones: v.observaciones || undefined,
    rpe: v.rpe ? Number(v.rpe) : undefined,
  }
}

function restriccionBody(v: Record<string, string>): MedicalRestrictionRequest {
  return {
    deportistaId: v.deportistaId,
    clinicalEvaluationId: v.clinicalEvaluationId,
    restrictionType: v.restrictionType as MedicalRestrictionRequest['restrictionType'],
    descripcion: v.descripcion,
    activa: v.activa ? v.activa === 'true' : undefined,
    fechaInicio: aIsoFecha(v.fechaInicio)!,
    fechaFin: aIsoFecha(v.fechaFin),
  }
}
