/* Opciones de enum tomadas del contrato OpenAPI REAL del backend
   (verificadas contra el spec desplegado). Los enums de types.ts no siempre
   coinciden con estos valores: para formularios de escritura manda el spec. */

import { estadoVisual } from './estadoVisual'

const opts = (valores: string[]) =>
  valores.map((v) => ({ value: v, label: estadoVisual(v).etiqueta }))

// IoT
export const CONEXION = opts(['REAL', 'SIMULADA', 'INACTIVA'])
export const CALIBRACION = opts(['CALIBRADA', 'DESCALIBRADA', 'EN_PROCESO'])
export const TIPO_ALERTA_MANT = opts([
  'DESCALIBRACION',
  'SIN_TELEMETRIA',
  'VALOR_FUERA_DE_RANGO',
  'MANTENIMIENTO_PREVENTIVO',
])

// Prescripción (AI)
export const GRUPO_MUSCULAR = opts([
  'PECHO', 'ESPALDA', 'HOMBROS', 'BICEPS', 'TRICEPS', 'ANTEBRAZOS',
  'CORE', 'GLUTEOS', 'CUADRICEPS', 'ISQUIOS', 'PANTORRILLAS', 'CUERPO_COMPLETO',
])
export const CATEGORIA_EJERCICIO = opts([
  'FUERZA', 'CARDIO', 'FLEXIBILIDAD', 'MOVILIDAD', 'EQUILIBRIO', 'REHABILITACION',
])
export const DIFICULTAD = opts(['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'])
export const TIPO_EJERCICIO = opts(['PESO_CORPORAL', 'PESO_LIBRE', 'MAQUINA', 'FUNCIONAL'])
export const OBJETIVO_PLAN = opts([
  'PERDIDA_PESO', 'GANANCIA_MUSCULAR', 'FUERZA', 'RESISTENCIA', 'REHABILITACION', 'CONDICION_FISICA_GENERAL',
])
export const ESTADO_PLAN_ENTRENAMIENTO = opts(['BORRADOR', 'ACTIVO', 'COMPLETADO', 'CANCELADO'])

// Clínico
export const RESTRICTION_TYPE = opts([
  'NINGUNA', 'CARDIOVASCULAR', 'MUSCULAR', 'ARTICULAR', 'NEUROLOGICA', 'POST_OPERATORIA', 'TEMPORAL', 'PERMANENTE',
])
export const APPROVAL_STATUS = opts(['PENDIENTE', 'APROBADO', 'RECHAZADO'])
export const TIPO_RESTRICCION = opts(['SOBREESFUERZO', 'RPE_ALTO', 'RIESGO_LESION'])
export const NIVEL_RIESGO = opts(['BAJO', 'MEDIO', 'ALTO', 'CRITICO'])

// Exergames
export const TIPO_JUEGO = opts(['DANCE_BEAT', 'BOXING_VR', 'CARDIO_RUSH', 'EQUILIBRIO_PRO'])
export const TIPO_DESAFIO = opts(['GLOBAL', 'MENSUAL'])
export const ORIGEN_SESION = opts(['MANUAL', 'SIMULADOR', 'SENSOR_REAL'])

// Agendamiento
export const TIPO_ESPACIO = opts(['GIMNASIO_GENERAL', 'EXERGAMES', 'CONSULTORIO'])

// Manillas NFC
export const ESTADO_MANILLA = opts(['ACTIVA', 'INACTIVA', 'PERDIDA', 'DUPLICADA', 'SUSPENDIDA'])
