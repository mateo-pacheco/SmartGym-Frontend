/* Tipos generados a mano desde `openapi.yaml` (SmartGym API v1.0.0, contrato
   completo). Fuente de verdad: el contrato del backend; no inventar campos. */

// ---------------------------------------------------------------------------
// Enums — Identity Access Security
// ---------------------------------------------------------------------------

export type EstadoManilla =
  | 'ACTIVA'
  | 'PERDIDA'
  | 'BLOQUEADA_TEMPORAL'
  | 'DESACTIVADA'
  | 'REPUESTA'
  | 'VENCIDA'

export type ResultadoAcceso = 'EXITOSO' | 'FALLIDO'

export type MotivoFalloAcceso =
  | 'MANILLA_NO_ENCONTRADA'
  | 'MANILLA_BLOQUEADA'
  | 'MANILLA_VENCIDA'
  | 'DEPORTISTA_INACTIVO'
  | 'MAQUINA_NO_AUTORIZADA'
  | 'CODIGO_NFC_INVALIDO'
  | 'GATEWAY_NO_AUTORIZADO'
  | 'GATEWAY_SUSPENDIDO'
  | 'ERROR_INTERNO'

export type AccionAuditoriaManilla =
  | 'REGISTRAR_MANILLA'
  | 'BLOQUEAR_MANILLA'
  | 'REPONER_MANILLA'
  | 'DESBLOQUEAR_MANILLA'
  | 'ACTUALIZAR_ESTADO'

// ---------------------------------------------------------------------------
// Enums — Clinical Physiotherapy
// ---------------------------------------------------------------------------

export type ApprovalStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'EXPIRADO'

export type AlertType =
  | 'CARDIOVASCULAR'
  | 'MUSCULOESQUELETICO'
  | 'RESPIRATORIO'
  | 'METABOLICO'
  | 'NEUROLOGICO'
  | 'GENERAL'

export type AlertLevel = 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO'

export type RestrictionType = 'TEMPORAL' | 'PERMANENTE' | 'PARCIAL' | 'TOTAL'

// ---------------------------------------------------------------------------
// Enums — IoT
// ---------------------------------------------------------------------------

export type EstadoConexion = 'CONECTADO' | 'DESCONECTADO' | 'MANTENIMIENTO' | 'ERROR'

export type EstadoCalibracion = 'CALIBRADA' | 'NO_CALIBRADA' | 'EN_PROCESO' | 'ERROR'

export type TipoDato =
  | 'FRECUENCIA_CARDIACA'
  | 'VELOCIDAD'
  | 'DISTANCIA'
  | 'POTENCIA'
  | 'PESO'
  | 'REPETICIONES'
  | 'TIEMPO'
  | 'OTRO'

export type OrigenDato = 'IOT' | 'MANUAL' | 'EXERGAME' | 'SISTEMA'

export type TipoAlertaMantenimiento =
  | 'MANTENIMIENTO_PREVENTIVO'
  | 'MANTENIMIENTO_CORRECTIVO'
  | 'CALIBRACION'
  | 'SEGURIDAD'
  | 'OTRO'

export type EstadoAlertaMantenimiento = 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA' | 'CERRADA'

// ---------------------------------------------------------------------------
// Enums — Exergames
// ---------------------------------------------------------------------------

export type TipoJuego = 'CARDIO' | 'EQUILIBRIO' | 'COORDINACION' | 'FUERZA' | 'REHABILITACION'

export type PoblacionObjetivo =
  | 'ADULTO_MAYOR'
  | 'REHABILITACION'
  | 'EMBARAZADA'
  | 'PRINCIPIANTE'
  | 'INTERMEDIO'
  | 'AVANZADO'
  | 'GENERAL'

export type TipoDesafio = 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'GLOBAL'

// ---------------------------------------------------------------------------
// Enums — AI Prescription
// ---------------------------------------------------------------------------

export type GrupoMuscular =
  | 'PECHO'
  | 'ESPALDA'
  | 'HOMBROS'
  | 'BICEPS'
  | 'TRICEPS'
  | 'PIERNAS'
  | 'GLUTEOS'
  | 'ABDOMEN'
  | 'CUERPO_COMPLETO'

export type CategoriaEjercicio =
  | 'FUERZA'
  | 'CARDIO'
  | 'FLEXIBILIDAD'
  | 'EQUILIBRIO'
  | 'REHABILITACION'

export type DificultadEjercicio = 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'

export type TipoEjercicioAI =
  | 'COMPUESTO'
  | 'AISLAMIENTO'
  | 'CARDIOVASCULAR'
  | 'ESTIRAMIENTO'
  | 'PLIOMETRICO'

export type ObjetivoPlantilla =
  | 'HIPERTROFIA'
  | 'RESISTENCIA'
  | 'PERDIDA_DE_PESO'
  | 'FUERZA'
  | 'REHABILITACION'
  | 'MANTENIMIENTO'

export type EstadoPlan = 'ACTIVO' | 'COMPLETADO' | 'CANCELADO' | 'EN_PAUSA'

// ---------------------------------------------------------------------------
// Enums — Agendamiento
// ---------------------------------------------------------------------------

export type EstadoSlot = 'DISPONIBLE' | 'COMPLETO' | 'CERRADO'

export type TipoReserva = 'CUPO' | 'CITA_SALUD' | 'EVENTO'

export type EstadoReserva = 'ACTIVA' | 'CANCELADA' | 'COMPLETADA' | 'NO_ASISTIO'

export type TipoEspacio = 'SALA' | 'ZONA' | 'CONSULTORIO'

// ---------------------------------------------------------------------------
// Comunes
// ---------------------------------------------------------------------------

/** Página que devuelven los listados paginados (accesos, telemetría v1). */
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  page: number
}

export interface PageQuery {
  page?: number
  size?: number
}

export interface FieldError {
  field?: string
  message?: string
}

export interface ErrorResponseDTO {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
  fieldErrors?: FieldError[]
}

// ---------------------------------------------------------------------------
// Identity Access Security — Manillas NFC
// ---------------------------------------------------------------------------

export interface RegistrarManillaNfcRequestDTO {
  codigoNfc: string
  deportistaId: string
}

export interface BloquearManillaRequestDTO {
  estadoNuevo: EstadoManilla
  actorId?: string
  actorTipo: string
  motivo: string
}

export interface ReponerManillaRequestDTO {
  codigoNfc: string
  estadoBloqueo?: EstadoManilla
  actorId?: string
  actorTipo: string
  motivo?: string
}

export interface ManillaNfcResponseDTO {
  id: string
  /** Código NFC enmascarado: el valor real nunca llega al cliente. */
  codigoNfcMascara: string
  estado: EstadoManilla
  deportistaId: string
  fechaAsignacion: string
  esReposicion: boolean
  creadoEn: string
  actualizadoEn: string
}

// ---------------------------------------------------------------------------
// Identity Access Security — Accesos NFC
// ---------------------------------------------------------------------------

export interface ValidarAccesoNfcRequestDTO {
  codigoNfc: string
  maquinaId: string
  eventoGatewayId: string
  fechaHoraGateway: string
}

export interface ValidacionAccesoResponseDTO {
  accesoPermitido: boolean
  codigoRespuesta: string
  eventoGatewayId: string
  fechaHoraServidor: string
}

export interface AccesoNfcHistorialResponseDTO {
  id: string
  lecturaId: string
  manillaId: string
  deportistaId: string
  maquinaId: string
  sedeId: string
  gatewayId: string
  fechaHoraGateway: string
  fechaHoraServidor: string
  resultado: ResultadoAcceso
  tiempoRespuestaMs: number
}

export interface ConsultarAccesosQuery extends PageQuery {
  deportistaId?: string
  maquinaId?: string
  sedeId?: string
  fechaDesde?: string
  fechaHasta?: string
}

export interface IntentoFallidoAccesoResponseDTO {
  id: string
  lecturaId: string
  maquinaId: string
  sedeId: string
  gatewayId: string
  fechaHoraGateway: string
  fechaHoraServidor: string
  motivo: MotivoFalloAcceso
  creadoEn: string
}

export interface AuditoriaManillaResponseDTO {
  id: string
  manillaId: string
  actorId: string
  actorTipo: string
  accion: AccionAuditoriaManilla
  estadoAnterior: EstadoManilla
  estadoNuevo: EstadoManilla
  fechaHora: string
  detalle: string
  creadoEn: string
}

// ---------------------------------------------------------------------------
// Clinical Physiotherapy
// ---------------------------------------------------------------------------

export interface ClinicalEvaluationRequest {
  deportistaId: string
  profesionalId: string
  diagnostico: string
  observaciones?: string
  /** Rating of Perceived Exertion (0-10). */
  rpe?: number
}

export interface ClinicalEvaluationResponse {
  id: string
  deportistaId: string
  profesionalId: string
  fechaEvaluacion: string
  diagnostico: string
  observaciones?: string
  rpe?: number
  version: number
  creadoEn: string
  actualizadoEn: string
}

export interface GymApprovalRequest {
  deportistaId: string
  medicoId: string
  estado: ApprovalStatus
  tipoRestriccion: AlertType
  observaciones?: string
  fechaExpiracion?: string
}

export interface GymApprovalResponse {
  id: string
  deportistaId: string
  medicoId: string
  estado: ApprovalStatus
  tipoRestriccion: AlertType
  observaciones?: string
  fechaValidacion: string
  fechaExpiracion?: string
  version: number
  creadoEn: string
  actualizadoEn: string
}

export interface MedicalRestrictionRequest {
  deportistaId: string
  clinicalEvaluationId: string
  restrictionType: RestrictionType
  descripcion: string
  activa?: boolean
  fechaInicio: string
  fechaFin?: string
}

export interface MedicalRestrictionResponse {
  id: string
  deportistaId: string
  clinicalEvaluationId: string
  restrictionType: RestrictionType
  descripcion: string
  activa: boolean
  fechaInicio: string
  fechaFin?: string
  version: number
  creadoEn: string
  actualizadoEn: string
}

export interface RiskAlertRequest {
  deportistaId: string
  tipoAlerta: AlertType
  nivelRiesgo: AlertLevel
  descripcion?: string
  rpe?: number
  activa?: boolean
}

export interface RiskAlertResponse {
  id: string
  deportistaId: string
  tipoAlerta: AlertType
  nivelRiesgo: AlertLevel
  descripcion?: string
  rpe?: number
  activa: boolean
  fechaDeteccion: string
  version: number
  creadoEn: string
  actualizadoEn: string
}

// ---------------------------------------------------------------------------
// Management Analytics
// ---------------------------------------------------------------------------

export interface BusinessKpiAggregateResponse {
  startDate: string
  endDate: string
  recordsAnalyzed: number
  dataAvailable: boolean
  averageActiveMemberships?: number
  averageRetentionRate?: number
  averageHourlyOccupancy?: number
  message?: string
}

export interface HealthImpactAggregateResponse {
  startDate: string
  endDate: string
  recordsAnalyzed: number
  dataAvailable: boolean
  clinicalImprovementPercentage?: number
  communityTraceabilityPercentage?: number
  message?: string
}

export interface ManagementAnalyticsDashboardResponse {
  startDate: string
  endDate: string
  businessKpis: BusinessKpiAggregateResponse
  healthImpact: HealthImpactAggregateResponse
}

// ---------------------------------------------------------------------------
// Smart Nutrition (ids UUID según el contrato completo)
// ---------------------------------------------------------------------------

export interface PlanNutricionalDTO {
  /** readOnly: lo asigna el backend. */
  id?: string
  nombre: string
  objetivo: string
  fechaInicio: string
  fechaFin: string
  caloriasObjetivo: number
}

export interface DetallePlanDTO {
  id?: string
  /** Tipo de comida (ej. Desayuno, Almuerzo, Cena). */
  tipoComida: string
  cantidad: number
  observacion?: string
  planNutricionalId: string
  alimentoId: string
}

export interface AlimentoDTO {
  id?: string
  nombre: string
  categoria: string
  calorias: number
  proteinas: number
  carbohidratos: number
  grasas: number
  porcion: number
}

// ---------------------------------------------------------------------------
// IoT — Máquinas
// ---------------------------------------------------------------------------

export interface MaquinaRequestDTO {
  nombre: string
  tipo: string
  ubicacion: string
  estadoConexion: EstadoConexion
  estadoCalibracion: EstadoCalibracion
}

export interface MaquinaResponseDTO {
  id: string
  nombre: string
  tipo: string
  ubicacion: string
  estadoConexion: EstadoConexion
  estadoCalibracion: EstadoCalibracion
  fechaUltimoMantenimiento?: string
  createdAt: string
}

// ---------------------------------------------------------------------------
// IoT — Telemetría
// ---------------------------------------------------------------------------

export interface LecturaTelemetriaRequestDTO {
  maquinaId?: string
  usuarioId?: string
  tipoDato: TipoDato
  valor: number
  unidad: string
  origen: OrigenDato
  capturadoEn: string
}

export interface LecturaTelemetriaResponseDTO {
  id: string
  maquinaId?: string
  usuarioId?: string
  tipoDato: TipoDato
  valor: number
  unidad: string
  origen: OrigenDato
  capturadoEn: string
}

// ---------------------------------------------------------------------------
// IoT — Alertas de mantenimiento y fatiga
// ---------------------------------------------------------------------------

export interface AlertaMantenimientoRequestDTO {
  maquinaId: string
  tipoAlerta: TipoAlertaMantenimiento
  descripcion: string
}

export interface AlertaMantenimientoResponseDTO {
  id: string
  maquinaId: string
  tipoAlerta: TipoAlertaMantenimiento
  descripcion: string
  estado: EstadoAlertaMantenimiento
  creadoEn: string
}

export interface EstadoAlertaUpdateRequestDTO {
  estado: EstadoAlertaMantenimiento
}

export interface RegistroFatigaRequestDTO {
  usuarioId: string
}

export interface RegistroFatigaResponseDTO {
  id: string
  usuarioId: string
  /** Nivel de fatiga del usuario (0-100). */
  nivelFatiga: number
  recomendacion: string
  calculadoEn: string
}

// ---------------------------------------------------------------------------
// Exergames
// ---------------------------------------------------------------------------

export interface SesionExergameRequestDTO {
  usuarioId: string
  estacionId: string
  iniciadoEn: string
  duracionSegundos?: number
  metricaCardio?: number
  metricaCoordinacion?: number
  metricaEquilibrio?: number
  origen: OrigenDato
}

export interface SesionExergameResponseDTO {
  id: string
  usuarioId: string
  estacionId: string
  iniciadoEn: string
  duracionSegundos?: number
  metricaCardio?: number
  metricaCoordinacion?: number
  metricaEquilibrio?: number
  origen: OrigenDato
}

export interface EstacionXrRequestDTO {
  nombre: string
  tipoJuego: TipoJuego
  estadoConexion: EstadoConexion
}

export interface EstacionXrResponseDTO {
  id: string
  nombre: string
  tipoJuego: TipoJuego
  estadoConexion: EstadoConexion
}

export interface ProtocoloSeguridadResponseDTO {
  id: string
  poblacionObjetivo: PoblacionObjetivo
  restricciones: string
}

export interface DesafioRequestDTO {
  nombre: string
  tipo: TipoDesafio
  fechaInicio: string
  fechaFin: string
  criterioPuntaje?: string
}

export interface DesafioResponseDTO {
  id: string
  nombre: string
  tipo: TipoDesafio
  fechaInicio: string
  fechaFin: string
  criterioPuntaje?: string
}

export interface PuntajeRankingRequestDTO {
  usuarioId: string
  desafioId: string
  puntaje: number
}

export interface PuntajeRankingResponseDTO {
  id: string
  usuarioId: string
  desafioId: string
  puntaje: number
  posicion?: number
  actualizadoEn: string
}

// ---------------------------------------------------------------------------
// AI Prescription
// ---------------------------------------------------------------------------

export interface CreateEjercicioRequest {
  nombreEjercicio: string
  descripcionEjercicio?: string
  instrucciones?: string
  grupoMuscular: GrupoMuscular
  categoriaEjercicio: CategoriaEjercicio
  dificultadEjercicio: DificultadEjercicio
  tipoEjercicio: TipoEjercicioAI
  equipamiento?: string
  duracionEstimadaMinutos?: number
  caloriasEstimadas?: number
}

export interface UpdateEjercicioRequest {
  nombreEjercicio?: string
  descripcionEjercicio?: string
  instrucciones?: string
  grupoMuscular?: GrupoMuscular
  categoria?: CategoriaEjercicio
  dificultad?: DificultadEjercicio
  tipoEjercicio?: TipoEjercicioAI
  equipamiento?: string
  duracionEstimadaMinutos?: number
  caloriasEstimadas?: number
  activo?: boolean
}

export interface EjercicioResponse {
  id: string
  nombreEjercicio: string
  descripcionEjercicio?: string
  instrucciones?: string
  grupoMuscular: GrupoMuscular
  categoria: CategoriaEjercicio
  dificultad: DificultadEjercicio
  tipoEjercicio: TipoEjercicioAI
  equipamiento?: string
  duracionEstimadaMinutos?: number
  caloriasEstimadas?: number
  activo: boolean
  fechaCreacion: string
}

export interface CreatePlantillaRutinaRequest {
  nombrePlantilla: string
  descripcionPlantilla?: string
  objetivo?: ObjetivoPlantilla
  dificultad?: DificultadEjercicio
  duracionEstimadaMinutos?: number
  activo?: boolean
}

export interface UpdatePlantillaRutinaRequest {
  nombrePlantilla?: string
  descripcionPlantilla?: string
  objetivo?: ObjetivoPlantilla
  dificultad?: DificultadEjercicio
  duracionEstimadaMinutos?: number
  activo?: boolean
}

export interface PlantillaRutinaResponse {
  id: string
  nombrePlantilla: string
  descripcionPlantilla?: string
  objetivo?: ObjetivoPlantilla
  dificultad?: DificultadEjercicio
  duracionEstimadaMinutos?: number
  activo: boolean
  fechaCreacion: string
}

export interface CreatePlanEntrenamientoRequest {
  deportistaId: string
  plantillaRutinaId?: string
  generadoPorIA: boolean
  objetivo: ObjetivoPlantilla
  fechaInicio: string
  fechaFin: string
  estado: EstadoPlan
}

export interface UpdatePlanEntrenamientoRequest {
  deportistaId?: string
  plantillaRutinaId?: string
  generadoPorIA?: boolean
  objetivo?: ObjetivoPlantilla
  fechaInicio?: string
  fechaFin?: string
  estado?: EstadoPlan
}

export interface PlanEntrenamientoResponse {
  id: string
  deportistaId: string
  plantillaRutinaId?: string
  generadoPorIA: boolean
  objetivo: ObjetivoPlantilla
  fechaInicio: string
  fechaFin: string
  estado: EstadoPlan
}

// ---------------------------------------------------------------------------
// Agendamiento
// ---------------------------------------------------------------------------

export interface SlotHorarioResponseDTO {
  id: string
  espacioId: string
  fecha: string
  horaInicio: string
  horaFin: string
  cuposTotales: number
  cuposDisponibles: number
  estado: EstadoSlot
}

export interface ReservaRequestDTO {
  usuarioId: string
  slotId: string
  tipo?: string
}

export interface ReservaResponseDTO {
  id: string
  usuarioId: string
  slotId: string
  tipo: TipoReserva
  estado: EstadoReserva
  creadoEn: string
}

export interface EspacioZonaRequestDTO {
  nombre: string
  tipo: TipoEspacio
  capacidadMaxima: number
}

export interface EspacioZonaResponseDTO {
  id: string
  nombre: string
  tipo: TipoEspacio
  capacidadMaxima: number
}

export interface RegistroAforoRequestDTO {
  espacioId: string
  conteoActual: number
}

export interface RegistroAforoResponseDTO {
  id: string
  espacioId: string
  medidoEn: string
  conteoActual: number
}

export interface CitaSaludRequestDTO {
  reservaId: string
  especialistaId: string
  tipoEspecialista: string
  motivo: string
}

export interface CitaSaludResponseDTO {
  id: string
  reservaId: string
  especialistaId: string
  tipoEspecialista: string
  motivo: string
  createdAt: string
}
