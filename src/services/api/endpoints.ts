/* Funciones tipadas por módulo, 1:1 con los operationId de openapi.yaml
   (contrato completo). Todas requieren backend configurado
   (VITE_SMARTGYM_API_URL) y, para los recursos protegidos, un JWT de sesión
   establecido con setApiToken (lo hace iniciarSesion). */

import { descargarArchivo, request, type QueryValue } from './http'
import type {
  AccesoNfcHistorialResponseDTO,
  AccionAuditoriaManilla,
  AlertaMantenimientoRequestDTO,
  AlertaMantenimientoResponseDTO,
  AlimentoDTO,
  AuditoriaManillaResponseDTO,
  BloquearManillaRequestDTO,
  CitaSaludRequestDTO,
  CitaSaludResponseDTO,
  ClinicalEvaluationRequest,
  ClinicalEvaluationResponse,
  ConsultarAccesosQuery,
  CreateEjercicioRequest,
  CreatePlanEntrenamientoRequest,
  CreatePlantillaRutinaRequest,
  DesafioRequestDTO,
  DesafioResponseDTO,
  DetallePlanDTO,
  EjercicioResponse,
  EspacioZonaRequestDTO,
  EspacioZonaResponseDTO,
  EstacionXrRequestDTO,
  EstacionXrResponseDTO,
  EstadoAlertaUpdateRequestDTO,
  GymApprovalRequest,
  GymApprovalResponse,
  IntentoFallidoAccesoResponseDTO,
  LecturaTelemetriaRequestDTO,
  LecturaTelemetriaResponseDTO,
  ManagementAnalyticsDashboardResponse,
  ManillaNfcResponseDTO,
  MaquinaRequestDTO,
  MaquinaResponseDTO,
  MedicalRestrictionRequest,
  MedicalRestrictionResponse,
  MotivoFalloAcceso,
  PageQuery,
  PageResponse,
  PlanEntrenamientoResponse,
  PlanNutricionalDTO,
  PlantillaRutinaResponse,
  ProtocoloSeguridadResponseDTO,
  PuntajeRankingRequestDTO,
  PuntajeRankingResponseDTO,
  RegistrarManillaNfcRequestDTO,
  RegistroAforoRequestDTO,
  RegistroAforoResponseDTO,
  RegistroFatigaRequestDTO,
  RegistroFatigaResponseDTO,
  ReponerManillaRequestDTO,
  ReservaRequestDTO,
  ReservaResponseDTO,
  RiskAlertRequest,
  RiskAlertResponse,
  SesionExergameRequestDTO,
  SesionExergameResponseDTO,
  SlotHorarioResponseDTO,
  UpdateEjercicioRequest,
  UpdatePlanEntrenamientoRequest,
  UpdatePlantillaRutinaRequest,
  ValidarAccesoNfcRequestDTO,
  ValidacionAccesoResponseDTO,
} from './types'

const asQuery = (q: object): Record<string, QueryValue> => ({ ...q })

/* ---------- Reportes descargables (PDF / Excel) ----------
   El contrato expone, por módulo, `/reportes/pdf` y `/reportes/excel`. Se
   consumen con descargarArchivo (binario + Content-Disposition), no con
   request (JSON). Las rutas van literales para que la verificación de
   cobertura del contrato pueda extraerlas. */
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const fechaArchivo = () => new Date().toISOString().slice(0, 10)
const pdf = (nombre: string) => ({ filename: `${nombre}-${fechaArchivo()}.pdf` })
const xlsx = (nombre: string) => ({
  filename: `${nombre}-${fechaArchivo()}.xlsx`,
  accept: XLSX_MIME,
})

// ---------------------------------------------------------------------------
// Identity Access Security — Manillas NFC
// ---------------------------------------------------------------------------

export const manillasNfc = {
  registrar: (body: RegistrarManillaNfcRequestDTO) =>
    request<ManillaNfcResponseDTO>('/api/v1/manillas-nfc', { method: 'POST', body }),

  bloquear: (id: string, body: BloquearManillaRequestDTO) =>
    request<ManillaNfcResponseDTO>(`/api/v1/manillas-nfc/${id}/bloquear`, {
      method: 'POST',
      body,
    }),

  reponer: (id: string, body: ReponerManillaRequestDTO) =>
    request<ManillaNfcResponseDTO>(`/api/v1/manillas-nfc/${id}/reponer`, {
      method: 'POST',
      body,
    }),

  historialPorDeportista: (deportistaId: string, query: PageQuery = {}) =>
    request<PageResponse<ManillaNfcResponseDTO>>(
      `/api/v1/manillas-nfc/deportista/${deportistaId}`,
      { query: asQuery(query) },
    ),

  reportePdf: () => descargarArchivo('/api/v1/manillas-nfc/reportes/pdf', pdf('manillas-nfc')),
  reporteExcel: () => descargarArchivo('/api/v1/manillas-nfc/reportes/excel', xlsx('manillas-nfc')),
}

// ---------------------------------------------------------------------------
// Identity Access Security — Accesos NFC
// ---------------------------------------------------------------------------

export interface ConsultarIntentosFallidosQuery extends PageQuery {
  maquinaId?: string
  motivo?: MotivoFalloAcceso
  fechaDesde?: string
  fechaHasta?: string
}

export interface ConsultarAuditoriasQuery extends PageQuery {
  manillaId?: string
  accion?: AccionAuditoriaManilla
  fechaDesde?: string
  fechaHasta?: string
}

export const accesosNfc = {
  /** Endpoint del gateway: valida una lectura NFC contra una máquina. */
  validar: (body: ValidarAccesoNfcRequestDTO) =>
    request<ValidacionAccesoResponseDTO>('/api/v1/accesos-nfc/validar', {
      method: 'POST',
      body,
    }),

  consultar: (query: ConsultarAccesosQuery = {}) =>
    request<PageResponse<AccesoNfcHistorialResponseDTO>>('/api/v1/accesos-nfc', {
      query: asQuery(query),
    }),

  intentosFallidos: (query: ConsultarIntentosFallidosQuery = {}) =>
    request<PageResponse<IntentoFallidoAccesoResponseDTO>>('/api/v1/intentos-fallidos', {
      query: asQuery(query),
    }),

  auditoriasManillas: (query: ConsultarAuditoriasQuery = {}) =>
    request<PageResponse<AuditoriaManillaResponseDTO>>('/api/v1/auditorias-manillas', {
      query: asQuery(query),
    }),

  reporteAccesosPdf: () => descargarArchivo('/api/v1/accesos-nfc/reportes/pdf', pdf('accesos-nfc')),
  reporteAccesosExcel: () => descargarArchivo('/api/v1/accesos-nfc/reportes/excel', xlsx('accesos-nfc')),
  reporteIntentosFallidosPdf: () =>
    descargarArchivo('/api/v1/intentos-fallidos/reportes/pdf', pdf('intentos-fallidos')),
  reporteIntentosFallidosExcel: () =>
    descargarArchivo('/api/v1/intentos-fallidos/reportes/excel', xlsx('intentos-fallidos')),
  reporteAuditoriasPdf: () =>
    descargarArchivo('/api/v1/auditorias-manillas/reportes/pdf', pdf('auditorias-manillas')),
  reporteAuditoriasExcel: () =>
    descargarArchivo('/api/v1/auditorias-manillas/reportes/excel', xlsx('auditorias-manillas')),
}

// ---------------------------------------------------------------------------
// Clinical Physiotherapy — Aprobaciones de gimnasio
// ---------------------------------------------------------------------------

export const gymApprovals = {
  listar: () => request<GymApprovalResponse[]>('/api/gym-approvals'),
  crear: (body: GymApprovalRequest) =>
    request<GymApprovalResponse>('/api/gym-approvals', { method: 'POST', body }),
  obtener: (id: string) => request<GymApprovalResponse>(`/api/gym-approvals/${id}`),
  actualizar: (id: string, body: GymApprovalRequest) =>
    request<GymApprovalResponse>(`/api/gym-approvals/${id}`, { method: 'PUT', body }),
  eliminar: (id: string) => request<void>(`/api/gym-approvals/${id}`, { method: 'DELETE' }),
  porDeportista: (deportistaId: string) =>
    request<GymApprovalResponse[]>(`/api/gym-approvals/deportista/${deportistaId}`),

  reportePdf: () => descargarArchivo('/api/gym-approvals/reportes/pdf', pdf('aprobaciones-gimnasio')),
  reporteExcel: () => descargarArchivo('/api/gym-approvals/reportes/excel', xlsx('aprobaciones-gimnasio')),
}

// ---------------------------------------------------------------------------
// Clinical Physiotherapy — Evaluaciones clínicas
// ---------------------------------------------------------------------------

export const clinicalEvaluations = {
  listar: () => request<ClinicalEvaluationResponse[]>('/api/clinical-evaluations'),
  crear: (body: ClinicalEvaluationRequest) =>
    request<ClinicalEvaluationResponse>('/api/clinical-evaluations', { method: 'POST', body }),
  obtener: (id: string) =>
    request<ClinicalEvaluationResponse>(`/api/clinical-evaluations/${id}`),
  actualizar: (id: string, body: ClinicalEvaluationRequest) =>
    request<ClinicalEvaluationResponse>(`/api/clinical-evaluations/${id}`, {
      method: 'PUT',
      body,
    }),
  eliminar: (id: string) =>
    request<void>(`/api/clinical-evaluations/${id}`, { method: 'DELETE' }),
  porDeportista: (deportistaId: string) =>
    request<ClinicalEvaluationResponse[]>(`/api/clinical-evaluations/deportista/${deportistaId}`),

  reportePdf: () => descargarArchivo('/api/clinical-evaluations/reportes/pdf', pdf('evaluaciones-clinicas')),
  reporteExcel: () => descargarArchivo('/api/clinical-evaluations/reportes/excel', xlsx('evaluaciones-clinicas')),
}

// ---------------------------------------------------------------------------
// Clinical Physiotherapy — Restricciones médicas
// ---------------------------------------------------------------------------

export const medicalRestrictions = {
  listar: () => request<MedicalRestrictionResponse[]>('/api/medical-restrictions'),
  crear: (body: MedicalRestrictionRequest) =>
    request<MedicalRestrictionResponse>('/api/medical-restrictions', { method: 'POST', body }),
  obtener: (id: string) =>
    request<MedicalRestrictionResponse>(`/api/medical-restrictions/${id}`),
  actualizar: (id: string, body: MedicalRestrictionRequest) =>
    request<MedicalRestrictionResponse>(`/api/medical-restrictions/${id}`, {
      method: 'PUT',
      body,
    }),
  eliminar: (id: string) =>
    request<void>(`/api/medical-restrictions/${id}`, { method: 'DELETE' }),
  porDeportista: (deportistaId: string) =>
    request<MedicalRestrictionResponse[]>(
      `/api/medical-restrictions/deportista/${deportistaId}`,
    ),
  activasPorDeportista: (deportistaId: string) =>
    request<MedicalRestrictionResponse[]>(
      `/api/medical-restrictions/deportista/${deportistaId}/active`,
    ),

  reportePdf: () => descargarArchivo('/api/medical-restrictions/reportes/pdf', pdf('restricciones-medicas')),
  reporteExcel: () => descargarArchivo('/api/medical-restrictions/reportes/excel', xlsx('restricciones-medicas')),
}

// ---------------------------------------------------------------------------
// Clinical Physiotherapy — Alertas de riesgo
// ---------------------------------------------------------------------------

export const riskAlerts = {
  listar: () => request<RiskAlertResponse[]>('/api/risk-alerts'),
  crear: (body: RiskAlertRequest) =>
    request<RiskAlertResponse>('/api/risk-alerts', { method: 'POST', body }),
  obtener: (id: string) => request<RiskAlertResponse>(`/api/risk-alerts/${id}`),
  actualizar: (id: string, body: RiskAlertRequest) =>
    request<RiskAlertResponse>(`/api/risk-alerts/${id}`, { method: 'PUT', body }),
  eliminar: (id: string) => request<void>(`/api/risk-alerts/${id}`, { method: 'DELETE' }),
  porDeportista: (deportistaId: string) =>
    request<RiskAlertResponse[]>(`/api/risk-alerts/deportista/${deportistaId}`),
  activas: () => request<RiskAlertResponse[]>('/api/risk-alerts/active'),

  reportePdf: () => descargarArchivo('/api/risk-alerts/reportes/pdf', pdf('alertas-riesgo')),
  reporteExcel: () => descargarArchivo('/api/risk-alerts/reportes/excel', xlsx('alertas-riesgo')),
}

// ---------------------------------------------------------------------------
// Management Analytics
// ---------------------------------------------------------------------------

export const managementAnalytics = {
  /** KPIs de negocio e impacto en salud para el rango [startDate, endDate] (yyyy-MM-dd). */
  dashboard: (startDate: string, endDate: string) =>
    request<ManagementAnalyticsDashboardResponse>('/api/v1/management-analytics/dashboard', {
      query: { startDate, endDate },
    }),

  reportePdf: (startDate: string, endDate: string) =>
    descargarArchivo('/api/v1/management-analytics/dashboard/reportes/pdf', {
      ...pdf('reporte-gestion'),
      query: { startDate, endDate },
    }),
  reporteExcel: (startDate: string, endDate: string) =>
    descargarArchivo('/api/v1/management-analytics/dashboard/reportes/excel', {
      ...xlsx('reporte-gestion'),
      query: { startDate, endDate },
    }),
}

// ---------------------------------------------------------------------------
// Smart Nutrition
// ---------------------------------------------------------------------------

export const planesNutricionales = {
  listar: () => request<PlanNutricionalDTO[]>('/api/planes'),
  crear: (body: PlanNutricionalDTO) =>
    request<PlanNutricionalDTO>('/api/planes', { method: 'POST', body }),
  obtener: (id: string) => request<PlanNutricionalDTO>(`/api/planes/${id}`),
  actualizar: (id: string, body: PlanNutricionalDTO) =>
    request<PlanNutricionalDTO>(`/api/planes/${id}`, { method: 'PUT', body }),
  eliminar: (id: string) => request<void>(`/api/planes/${id}`, { method: 'DELETE' }),

  reportePdf: () => descargarArchivo('/api/planes/reportes/pdf', pdf('planes-nutricionales')),
  reporteExcel: () => descargarArchivo('/api/planes/reportes/excel', xlsx('planes-nutricionales')),
}

export const detallesPlan = {
  listar: () => request<DetallePlanDTO[]>('/api/detalles'),
  crear: (body: DetallePlanDTO) =>
    request<DetallePlanDTO>('/api/detalles', { method: 'POST', body }),
  obtener: (id: string) => request<DetallePlanDTO>(`/api/detalles/${id}`),
  actualizar: (id: string, body: DetallePlanDTO) =>
    request<DetallePlanDTO>(`/api/detalles/${id}`, { method: 'PUT', body }),
  eliminar: (id: string) => request<void>(`/api/detalles/${id}`, { method: 'DELETE' }),

  reportePdf: () => descargarArchivo('/api/detalles/reportes/pdf', pdf('detalles-plan')),
  reporteExcel: () => descargarArchivo('/api/detalles/reportes/excel', xlsx('detalles-plan')),
}

export const alimentos = {
  listar: () => request<AlimentoDTO[]>('/api/alimentos'),
  crear: (body: AlimentoDTO) =>
    request<AlimentoDTO>('/api/alimentos', { method: 'POST', body }),
  obtener: (id: string) => request<AlimentoDTO>(`/api/alimentos/${id}`),
  actualizar: (id: string, body: AlimentoDTO) =>
    request<AlimentoDTO>(`/api/alimentos/${id}`, { method: 'PUT', body }),
  eliminar: (id: string) => request<void>(`/api/alimentos/${id}`, { method: 'DELETE' }),

  reportePdf: () => descargarArchivo('/api/alimentos/reportes/pdf', pdf('alimentos')),
  reporteExcel: () => descargarArchivo('/api/alimentos/reportes/excel', xlsx('alimentos')),
}

// ---------------------------------------------------------------------------
// IoT — Máquinas
// ---------------------------------------------------------------------------

export const iotMaquinas = {
  crear: (body: MaquinaRequestDTO) =>
    request<MaquinaResponseDTO>('/api/iot/maquinas', { method: 'POST', body }),
  listar: () => request<MaquinaResponseDTO[]>('/api/iot/maquinas'),
  obtener: (id: string) => request<MaquinaResponseDTO>(`/api/iot/maquinas/${id}`),

  reportePdf: () => descargarArchivo('/api/iot/maquinas/reportes/pdf', pdf('maquinas-iot')),
  reporteExcel: () => descargarArchivo('/api/iot/maquinas/reportes/excel', xlsx('maquinas-iot')),
}

// ---------------------------------------------------------------------------
// IoT — Telemetría
// ---------------------------------------------------------------------------

export const iotTelemetria = {
  registrar: (body: LecturaTelemetriaRequestDTO) =>
    request<LecturaTelemetriaResponseDTO>('/api/iot/telemetria', { method: 'POST', body }),

  /** Variante v1 con respuesta paginada compatible con las consultas v1. */
  registrarV1: (body: LecturaTelemetriaRequestDTO) =>
    request<LecturaTelemetriaResponseDTO>('/api/v1/iot/telemetria', { method: 'POST', body }),

  historialPorMaquina: (maquinaId: string) =>
    request<LecturaTelemetriaResponseDTO[]>(`/api/iot/maquinas/${maquinaId}/telemetria`),

  /** Variante paginada (v1). */
  porMaquina: (maquinaId: string, query: PageQuery = {}) =>
    request<PageResponse<LecturaTelemetriaResponseDTO>>(
      `/api/v1/iot/telemetria/maquina/${maquinaId}`,
      { query: asQuery(query) },
    ),

  porUsuario: (usuarioId: string, query: PageQuery = {}) =>
    request<PageResponse<LecturaTelemetriaResponseDTO>>(
      `/api/v1/iot/telemetria/usuario/${usuarioId}`,
      { query: asQuery(query) },
    ),

  reportePdf: () => descargarArchivo('/api/iot/telemetria/reportes/pdf', pdf('telemetria')),
  reporteExcel: () => descargarArchivo('/api/iot/telemetria/reportes/excel', xlsx('telemetria')),
  /** Variante v1 del reporte (mismo módulo, ruta versionada del contrato). */
  reporteV1Pdf: () => descargarArchivo('/api/v1/iot/telemetria/reportes/pdf', pdf('telemetria-v1')),
  reporteV1Excel: () => descargarArchivo('/api/v1/iot/telemetria/reportes/excel', xlsx('telemetria-v1')),
}

// ---------------------------------------------------------------------------
// IoT — Alertas de mantenimiento
// ---------------------------------------------------------------------------

export const iotAlertas = {
  abiertas: () =>
    request<AlertaMantenimientoResponseDTO[]>('/api/iot/mantenimiento/alertas'),
  registrar: (body: AlertaMantenimientoRequestDTO) =>
    request<AlertaMantenimientoResponseDTO>('/api/v1/iot/alertas', { method: 'POST', body }),
  actualizarEstado: (id: string, body: EstadoAlertaUpdateRequestDTO) =>
    request<AlertaMantenimientoResponseDTO>(`/api/v1/iot/alertas/${id}/estado`, {
      method: 'PATCH',
      body,
    }),
  porMaquina: (maquinaId: string) =>
    request<AlertaMantenimientoResponseDTO[]>(`/api/v1/iot/alertas/maquina/${maquinaId}`),
  evaluarMaquina: (maquinaId: string) =>
    request<void>(`/api/v1/iot/alertas/evaluar/${maquinaId}`, { method: 'POST' }),

  reportePdf: () => descargarArchivo('/api/v1/iot/alertas/reportes/pdf', pdf('alertas-mantenimiento')),
  reporteExcel: () => descargarArchivo('/api/v1/iot/alertas/reportes/excel', xlsx('alertas-mantenimiento')),
}

// ---------------------------------------------------------------------------
// IoT — Registro de fatiga
// ---------------------------------------------------------------------------

export const iotFatiga = {
  legadoPorUsuario: (usuarioId: string) =>
    request<RegistroFatigaResponseDTO>(`/api/iot/usuarios/${usuarioId}/fatiga`),
  calcular: (body: RegistroFatigaRequestDTO) =>
    request<RegistroFatigaResponseDTO>('/api/v1/iot/fatiga/calcular', { method: 'POST', body }),
  ultimo: (usuarioId: string) =>
    request<RegistroFatigaResponseDTO | undefined>(`/api/v1/iot/fatiga/ultimo/${usuarioId}`),

  reportePdf: () => descargarArchivo('/api/v1/iot/fatiga/reportes/pdf', pdf('fatiga')),
  reporteExcel: () => descargarArchivo('/api/v1/iot/fatiga/reportes/excel', xlsx('fatiga')),
}

// ---------------------------------------------------------------------------
// Exergames
// ---------------------------------------------------------------------------

export const exergames = {
  registrarSesion: (body: SesionExergameRequestDTO) =>
    request<SesionExergameResponseDTO>('/api/exergames/sesiones', { method: 'POST', body }),
  sesionesPorUsuario: (usuarioId: string) =>
    request<SesionExergameResponseDTO[]>(`/api/exergames/sesiones/usuario/${usuarioId}`),
  sesionesPorEstacion: (estacionId: string) =>
    request<SesionExergameResponseDTO[]>(`/api/exergames/sesiones/estacion/${estacionId}`),

  crearEstacion: (body: EstacionXrRequestDTO) =>
    request<EstacionXrResponseDTO>('/api/exergames/estaciones', { method: 'POST', body }),
  listarEstaciones: () => request<EstacionXrResponseDTO[]>('/api/exergames/estaciones'),
  obtenerEstacion: (id: string) =>
    request<EstacionXrResponseDTO>(`/api/exergames/estaciones/${id}`),

  protocolosSeguridad: (usuarioId: string) =>
    request<ProtocoloSeguridadResponseDTO[]>(
      `/api/exergames/usuarios/${usuarioId}/protocolo-seguridad`,
    ),

  crearDesafio: (body: DesafioRequestDTO) =>
    request<DesafioResponseDTO>('/api/exergames/desafios', { method: 'POST', body }),
  listarDesafios: () => request<DesafioResponseDTO[]>('/api/exergames/desafios'),
  registrarPuntaje: (body: PuntajeRankingRequestDTO) =>
    request<PuntajeRankingResponseDTO>('/api/exergames/desafios/puntajes', {
      method: 'POST',
      body,
    }),
  ranking: (desafioId: string) =>
    request<PuntajeRankingResponseDTO[]>(`/api/exergames/rankings/${desafioId}`),

  reporteSesionesPdf: () => descargarArchivo('/api/exergames/sesiones/reportes/pdf', pdf('sesiones-xr')),
  reporteSesionesExcel: () => descargarArchivo('/api/exergames/sesiones/reportes/excel', xlsx('sesiones-xr')),
  reporteEstacionesPdf: () => descargarArchivo('/api/exergames/estaciones/reportes/pdf', pdf('estaciones-xr')),
  reporteEstacionesExcel: () => descargarArchivo('/api/exergames/estaciones/reportes/excel', xlsx('estaciones-xr')),
  reporteDesafiosPdf: () => descargarArchivo('/api/exergames/desafios/reportes/pdf', pdf('desafios-xr')),
  reporteDesafiosExcel: () => descargarArchivo('/api/exergames/desafios/reportes/excel', xlsx('desafios-xr')),
  reporteProtocolosPdf: () =>
    descargarArchivo('/api/exergames/protocolo-seguridad/reportes/pdf', pdf('protocolos-seguridad')),
  reporteProtocolosExcel: () =>
    descargarArchivo('/api/exergames/protocolo-seguridad/reportes/excel', xlsx('protocolos-seguridad')),
}

// ---------------------------------------------------------------------------
// AI Prescription
// ---------------------------------------------------------------------------

export const aiEjercicios = {
  crear: (body: CreateEjercicioRequest) =>
    request<EjercicioResponse>('/api/aiprescription/ejercicios', { method: 'POST', body }),
  listar: () => request<EjercicioResponse[]>('/api/aiprescription/ejercicios'),
  obtener: (id: string) => request<EjercicioResponse>(`/api/aiprescription/ejercicios/${id}`),
  actualizar: (id: string, body: UpdateEjercicioRequest) =>
    request<EjercicioResponse>(`/api/aiprescription/ejercicios/${id}`, { method: 'PUT', body }),
  eliminar: (id: string) =>
    request<void>(`/api/aiprescription/ejercicios/${id}`, { method: 'DELETE' }),

  reportePdf: () => descargarArchivo('/api/aiprescription/ejercicios/reportes/pdf', pdf('ejercicios')),
  reporteExcel: () => descargarArchivo('/api/aiprescription/ejercicios/reportes/excel', xlsx('ejercicios')),
}

export const aiPlantillas = {
  crear: (body: CreatePlantillaRutinaRequest) =>
    request<PlantillaRutinaResponse>('/api/aiprescription/plantillas', { method: 'POST', body }),
  listar: () => request<PlantillaRutinaResponse[]>('/api/aiprescription/plantillas'),
  obtener: (id: string) =>
    request<PlantillaRutinaResponse>(`/api/aiprescription/plantillas/${id}`),
  actualizar: (id: string, body: UpdatePlantillaRutinaRequest) =>
    request<PlantillaRutinaResponse>(`/api/aiprescription/plantillas/${id}`, {
      method: 'PUT',
      body,
    }),
  eliminar: (id: string) =>
    request<void>(`/api/aiprescription/plantillas/${id}`, { method: 'DELETE' }),

  reportePdf: () => descargarArchivo('/api/aiprescription/plantillas/reportes/pdf', pdf('plantillas-rutina')),
  reporteExcel: () => descargarArchivo('/api/aiprescription/plantillas/reportes/excel', xlsx('plantillas-rutina')),
}

export const aiPlanes = {
  crear: (body: CreatePlanEntrenamientoRequest) =>
    request<PlanEntrenamientoResponse>('/api/aiprescription/planes', { method: 'POST', body }),
  listar: (deportistaId?: string) =>
    request<PlanEntrenamientoResponse[]>('/api/aiprescription/planes', {
      query: { deportistaId },
    }),
  obtener: (id: string) =>
    request<PlanEntrenamientoResponse>(`/api/aiprescription/planes/${id}`),
  actualizar: (id: string, body: UpdatePlanEntrenamientoRequest) =>
    request<PlanEntrenamientoResponse>(`/api/aiprescription/planes/${id}`, {
      method: 'PUT',
      body,
    }),
  eliminar: (id: string) =>
    request<void>(`/api/aiprescription/planes/${id}`, { method: 'DELETE' }),

  reportePdf: () => descargarArchivo('/api/aiprescription/planes/reportes/pdf', pdf('planes-entrenamiento')),
  reporteExcel: () => descargarArchivo('/api/aiprescription/planes/reportes/excel', xlsx('planes-entrenamiento')),
}

// ---------------------------------------------------------------------------
// Agendamiento
// ---------------------------------------------------------------------------

export const agendamiento = {
  /** Slots horarios de un espacio en una fecha (yyyy-MM-dd). */
  slots: (espacio: string, fecha: string) =>
    request<SlotHorarioResponseDTO[]>('/api/agendamiento/slots', {
      query: { espacio, fecha },
    }),

  crearReserva: (body: ReservaRequestDTO) =>
    request<ReservaResponseDTO>('/api/agendamiento/reservas', { method: 'POST', body }),
  cancelarReserva: (id: string, usuarioId: string) =>
    request<void>(`/api/agendamiento/reservas/${id}`, {
      method: 'DELETE',
      query: { usuarioId },
    }),

  crearEspacio: (body: EspacioZonaRequestDTO) =>
    request<EspacioZonaResponseDTO>('/api/agendamiento/espacios', { method: 'POST', body }),
  listarEspacios: () => request<EspacioZonaResponseDTO[]>('/api/agendamiento/espacios'),
  espaciosPorTipo: (tipo: string) =>
    request<EspacioZonaResponseDTO[]>(`/api/agendamiento/espacios/tipo/${tipo}`),
  obtenerEspacio: (id: string) =>
    request<EspacioZonaResponseDTO>(`/api/agendamiento/espacios/${id}`),

  registrarAforo: (body: RegistroAforoRequestDTO) =>
    request<RegistroAforoResponseDTO>('/api/agendamiento/espacios/aforo', {
      method: 'POST',
      body,
    }),
  aforoActual: (espacioId: string) =>
    request<RegistroAforoResponseDTO>(`/api/agendamiento/espacios/${espacioId}/aforo`),

  crearCitaSalud: (body: CitaSaludRequestDTO) =>
    request<CitaSaludResponseDTO>('/api/agendamiento/citas-salud', { method: 'POST', body }),
  citasSaludPorUsuario: (usuarioId: string) =>
    request<CitaSaludResponseDTO[]>(`/api/agendamiento/citas-salud/usuario/${usuarioId}`),

  /** El reporte de slots exige espacio y fecha, igual que la consulta. */
  reporteSlotsPdf: (espacio: string, fecha: string) =>
    descargarArchivo('/api/agendamiento/slots/reportes/pdf', {
      ...pdf('slots'),
      query: { espacio, fecha },
    }),
  reporteSlotsExcel: (espacio: string, fecha: string) =>
    descargarArchivo('/api/agendamiento/slots/reportes/excel', {
      ...xlsx('slots'),
      query: { espacio, fecha },
    }),
  reporteReservasPdf: () => descargarArchivo('/api/agendamiento/reservas/reportes/pdf', pdf('reservas')),
  reporteReservasExcel: () => descargarArchivo('/api/agendamiento/reservas/reportes/excel', xlsx('reservas')),
  reporteEspaciosPdf: () => descargarArchivo('/api/agendamiento/espacios/reportes/pdf', pdf('espacios')),
  reporteEspaciosExcel: () => descargarArchivo('/api/agendamiento/espacios/reportes/excel', xlsx('espacios')),
  reporteCitasSaludPdf: () =>
    descargarArchivo('/api/agendamiento/citas-salud/reportes/pdf', pdf('citas-salud')),
  reporteCitasSaludExcel: () =>
    descargarArchivo('/api/agendamiento/citas-salud/reportes/excel', xlsx('citas-salud')),
}
