/* Funciones tipadas por módulo, 1:1 con los operationId de openapi.yaml
   (contrato completo). Todas requieren backend configurado
   (VITE_SMARTGYM_API_URL) y, para los recursos protegidos, un JWT de sesión
   establecido con setApiToken (lo hace iniciarSesion). */

import { request, type QueryValue } from './http'
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
}

export const detallesPlan = {
  listar: () => request<DetallePlanDTO[]>('/api/detalles'),
  crear: (body: DetallePlanDTO) =>
    request<DetallePlanDTO>('/api/detalles', { method: 'POST', body }),
  obtener: (id: string) => request<DetallePlanDTO>(`/api/detalles/${id}`),
  actualizar: (id: string, body: DetallePlanDTO) =>
    request<DetallePlanDTO>(`/api/detalles/${id}`, { method: 'PUT', body }),
  eliminar: (id: string) => request<void>(`/api/detalles/${id}`, { method: 'DELETE' }),
}

export const alimentos = {
  listar: () => request<AlimentoDTO[]>('/api/alimentos'),
  crear: (body: AlimentoDTO) =>
    request<AlimentoDTO>('/api/alimentos', { method: 'POST', body }),
  obtener: (id: string) => request<AlimentoDTO>(`/api/alimentos/${id}`),
  actualizar: (id: string, body: AlimentoDTO) =>
    request<AlimentoDTO>(`/api/alimentos/${id}`, { method: 'PUT', body }),
  eliminar: (id: string) => request<void>(`/api/alimentos/${id}`, { method: 'DELETE' }),
}

// ---------------------------------------------------------------------------
// IoT — Máquinas
// ---------------------------------------------------------------------------

export const iotMaquinas = {
  crear: (body: MaquinaRequestDTO) =>
    request<MaquinaResponseDTO>('/api/iot/maquinas', { method: 'POST', body }),
  listar: () => request<MaquinaResponseDTO[]>('/api/iot/maquinas'),
  obtener: (id: string) => request<MaquinaResponseDTO>(`/api/iot/maquinas/${id}`),
}

// ---------------------------------------------------------------------------
// IoT — Telemetría
// ---------------------------------------------------------------------------

export const iotTelemetria = {
  registrar: (body: LecturaTelemetriaRequestDTO) =>
    request<LecturaTelemetriaResponseDTO>('/api/iot/telemetria', { method: 'POST', body }),

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
}

// ---------------------------------------------------------------------------
// IoT — Registro de fatiga
// ---------------------------------------------------------------------------

export const iotFatiga = {
  calcular: (body: RegistroFatigaRequestDTO) =>
    request<RegistroFatigaResponseDTO>('/api/v1/iot/fatiga/calcular', { method: 'POST', body }),
  ultimo: (usuarioId: string) =>
    request<RegistroFatigaResponseDTO | undefined>(`/api/v1/iot/fatiga/ultimo/${usuarioId}`),
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
}
