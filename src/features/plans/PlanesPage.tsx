import { PageHeader } from '../../components/navigation/PageHeader'
import { Tabs } from '../../components/navigation/Tabs'
import { CrudSection } from '../../components/data-display/CrudSection'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { UUID_RE, UUID_MSG } from '../../lib/validaciones'
import { useApiData } from '../../services/api/useApiData'
import { useAuth } from '../../services/api/useAuth'
import {
  aiEjercicios,
  aiPlanes,
  aiPlantillas,
  alimentos,
  detallesPlan,
  gymApprovals,
  planesNutricionales,
} from '../../services/api/endpoints'
import type { ValoresForm } from '../../components/forms/FormModal'
import { estadoVisual } from '../../lib/estadoVisual'
import {
  CATEGORIA_EJERCICIO,
  DIFICULTAD,
  ESTADO_PLAN_ENTRENAMIENTO,
  GRUPO_MUSCULAR,
  OBJETIVO_PLAN,
  TIPO_EJERCICIO,
} from '../../lib/opcionesContrato'
import type {
  AlimentoDTO,
  CreateEjercicioRequest,
  CreatePlanEntrenamientoRequest,
  CreatePlantillaRutinaRequest,
  DetallePlanDTO,
  EjercicioResponse,
  GymApprovalResponse,
  PlanEntrenamientoResponse,
  PlanNutricionalDTO,
  PlantillaRutinaResponse,
} from '../../services/api/types'

const num = (s: string) => Number(s)
const SI_NO = [{ value: 'true', label: 'Sí' }, { value: 'false', label: 'No' }]

export default function PlanesPage() {
  const { id: sesionId, esAdministrador, tieneRol } = useAuth()
  const esEstudiante = tieneRol('ESTUDIANTE')

  // --- Nutrición ---
  const planes = useApiData(() => planesNutricionales.listar())
  const catalogo = useApiData(() => alimentos.listar())
  const detalles = useApiData(() => detallesPlan.listar())

  // --- Prescripción ---
  const ejercicios = useApiData(() => aiEjercicios.listar())
  const plantillas = useApiData(() => aiPlantillas.listar())
  const planesEntreno = useApiData(() => aiPlanes.listar(esEstudiante ? sesionId ?? undefined : undefined))

  // --- Aprobaciones ---
  const aprobaciones = useApiData(() =>
    esEstudiante && sesionId ? gymApprovals.porDeportista(sesionId) : gymApprovals.listar(),
  )

  const nutricion = (
    <div className="d-grid gap-4">
      <CrudSection<PlanNutricionalDTO>
        titulo="Planes nutricionales"
        entidad="Plan"
        datos={planes}
        puedeGestionar={esAdministrador}
        illustration="plan"
        emptyTitle="Sin planes nutricionales"
        emptyBody="Crea un plan para asignar objetivos calóricos y detalles de comidas."
        idDe={(p) => p.id ?? ''}
        columnas={[
          { key: 'nombre', header: 'Plan' },
          { key: 'objetivo', header: 'Objetivo' },
          { key: 'rango', header: 'Vigencia' },
          { key: 'kcal', header: 'Kcal objetivo', align: 'end' },
        ]}
        fila={(p) => ({
          nombre: p.nombre,
          objetivo: p.objetivo,
          rango: `${p.fechaInicio} → ${p.fechaFin}`,
          kcal: `${p.caloriasObjetivo} kcal`,
        })}
        campos={[
          { key: 'nombre', label: 'Nombre', tipo: 'text', requerido: true },
          { key: 'objetivo', label: 'Objetivo', tipo: 'text', requerido: true },
          { key: 'fechaInicio', label: 'Fecha inicio', tipo: 'date', requerido: true, ancho: 'half' },
          { key: 'fechaFin', label: 'Fecha fin', tipo: 'date', requerido: true, ancho: 'half' },
          { key: 'caloriasObjetivo', label: 'Calorías objetivo', tipo: 'number', requerido: true, min: 0 },
        ]}
        aValores={(p) => ({
          nombre: p.nombre,
          objetivo: p.objetivo,
          fechaInicio: p.fechaInicio,
          fechaFin: p.fechaFin,
          caloriasObjetivo: String(p.caloriasObjetivo),
        })}
        crear={(v) => planesNutricionales.crear({ nombre: v.nombre, objetivo: v.objetivo, fechaInicio: v.fechaInicio, fechaFin: v.fechaFin, caloriasObjetivo: num(v.caloriasObjetivo) })}
        actualizar={(id, v) => planesNutricionales.actualizar(id, { id, nombre: v.nombre, objetivo: v.objetivo, fechaInicio: v.fechaInicio, fechaFin: v.fechaFin, caloriasObjetivo: num(v.caloriasObjetivo) })}
        eliminar={(id) => planesNutricionales.eliminar(id)}
        reporte={{ pdf: planesNutricionales.reportePdf, excel: planesNutricionales.reporteExcel }}
      />

      <CrudSection<AlimentoDTO>
        titulo="Catálogo de alimentos"
        entidad="Alimento"
        datos={catalogo}
        puedeGestionar={esAdministrador}
        illustration="plan"
        emptyTitle="Catálogo vacío"
        emptyBody="Agrega alimentos con sus macros para componer los planes."
        idDe={(a) => a.id ?? ''}
        pageSize={6}
        columnas={[
          { key: 'nombre', header: 'Alimento' },
          { key: 'categoria', header: 'Categoría' },
          { key: 'calorias', header: 'Kcal', align: 'end' },
          { key: 'macros', header: 'P/C/G', align: 'end' },
          { key: 'porcion', header: 'Porción', align: 'end' },
        ]}
        fila={(a) => ({
          nombre: a.nombre,
          categoria: a.categoria,
          calorias: a.calorias,
          macros: `${a.proteinas}/${a.carbohidratos}/${a.grasas}`,
          porcion: `${a.porcion} g`,
        })}
        campos={[
          { key: 'nombre', label: 'Nombre', tipo: 'text', requerido: true },
          { key: 'categoria', label: 'Categoría', tipo: 'text', requerido: true, ayuda: 'Ej.: Proteina, Cereal (sin tildes: el backend rechaza acentos).' },
          { key: 'calorias', label: 'Calorías', tipo: 'number', requerido: true, min: 0, ancho: 'half' },
          { key: 'porcion', label: 'Porción (g)', tipo: 'number', requerido: true, min: 0, ancho: 'half' },
          { key: 'proteinas', label: 'Proteínas (g)', tipo: 'number', requerido: true, min: 0, ancho: 'half' },
          { key: 'carbohidratos', label: 'Carbohidratos (g)', tipo: 'number', requerido: true, min: 0, ancho: 'half' },
          { key: 'grasas', label: 'Grasas (g)', tipo: 'number', requerido: true, min: 0, ancho: 'half' },
        ]}
        aValores={(a) => ({
          nombre: a.nombre, categoria: a.categoria, calorias: String(a.calorias), porcion: String(a.porcion),
          proteinas: String(a.proteinas), carbohidratos: String(a.carbohidratos), grasas: String(a.grasas),
        })}
        crear={(v) => alimentos.crear({ nombre: v.nombre, categoria: v.categoria, calorias: num(v.calorias), proteinas: num(v.proteinas), carbohidratos: num(v.carbohidratos), grasas: num(v.grasas), porcion: num(v.porcion) })}
        actualizar={(id, v) => alimentos.actualizar(id, { id, nombre: v.nombre, categoria: v.categoria, calorias: num(v.calorias), proteinas: num(v.proteinas), carbohidratos: num(v.carbohidratos), grasas: num(v.grasas), porcion: num(v.porcion) })}
        eliminar={(id) => alimentos.eliminar(id)}
        reporte={{ pdf: alimentos.reportePdf, excel: alimentos.reporteExcel }}
      />

      <CrudSection<DetallePlanDTO>
        titulo="Detalles de comidas"
        entidad="Detalle"
        datos={detalles}
        puedeGestionar={esAdministrador}
        illustration="plan"
        emptyTitle="Sin detalles de comidas"
        emptyBody="Vincula un alimento a un plan indicando comida y cantidad."
        idDe={(d) => d.id ?? ''}
        pageSize={6}
        columnas={[
          { key: 'comida', header: 'Comida' },
          { key: 'plan', header: 'Plan' },
          { key: 'alimento', header: 'Alimento' },
          { key: 'cantidad', header: 'Cantidad', align: 'end' },
        ]}
        fila={(d) => ({
          comida: d.tipoComida,
          plan: (planes.datos ?? []).find((p) => p.id === d.planNutricionalId)?.nombre ?? d.planNutricionalId,
          alimento: (catalogo.datos ?? []).find((a) => a.id === d.alimentoId)?.nombre ?? d.alimentoId,
          cantidad: d.cantidad,
        })}
        campos={[
          { key: 'tipoComida', label: 'Comida', tipo: 'text', requerido: true, placeholder: 'Desayuno, Almuerzo…', ancho: 'half' },
          { key: 'cantidad', label: 'Cantidad', tipo: 'number', requerido: true, min: 0, ancho: 'half' },
          { key: 'planNutricionalId', label: 'Plan', tipo: 'select', requerido: true, opciones: (planes.datos ?? []).map((p) => ({ value: p.id ?? '', label: p.nombre })) },
          { key: 'alimentoId', label: 'Alimento', tipo: 'select', requerido: true, opciones: (catalogo.datos ?? []).map((a) => ({ value: a.id ?? '', label: a.nombre })) },
          { key: 'observacion', label: 'Observación', tipo: 'textarea' },
        ]}
        aValores={(d) => ({ tipoComida: d.tipoComida, cantidad: String(d.cantidad), planNutricionalId: d.planNutricionalId, alimentoId: d.alimentoId, observacion: d.observacion ?? '' })}
        crear={(v) => detallesPlan.crear({ tipoComida: v.tipoComida, cantidad: num(v.cantidad), observacion: v.observacion || undefined, planNutricionalId: v.planNutricionalId, alimentoId: v.alimentoId })}
        actualizar={(id, v) => detallesPlan.actualizar(id, { id, tipoComida: v.tipoComida, cantidad: num(v.cantidad), observacion: v.observacion || undefined, planNutricionalId: v.planNutricionalId, alimentoId: v.alimentoId })}
        eliminar={(id) => detallesPlan.eliminar(id)}
        reporte={{ pdf: detallesPlan.reportePdf, excel: detallesPlan.reporteExcel }}
      />
    </div>
  )

  const prescripcion = (
    <div className="d-grid gap-4">
      <CrudSection<PlanEntrenamientoResponse>
        titulo="Planes de entrenamiento"
        entidad="Plan de entrenamiento"
        datos={planesEntreno}
        puedeGestionar={esAdministrador}
        illustration="plan"
        emptyTitle="Sin planes de entrenamiento"
        emptyBody="Crea un plan por deportista, con objetivo y vigencia."
        idDe={(p) => p.id}
        columnas={[
          { key: 'deportista', header: 'Deportista' },
          { key: 'objetivo', header: 'Objetivo' },
          { key: 'rango', header: 'Vigencia' },
          { key: 'estado', header: 'Estado' },
        ]}
        fila={(p) => ({
          deportista: p.deportistaId,
          objetivo: estadoVisual(p.objetivo).etiqueta,
          rango: `${p.fechaInicio} → ${p.fechaFin}`,
          estado: <StatusBadge tone={estadoVisual(p.estado).tono} label={estadoVisual(p.estado).etiqueta} />,
        })}
        campos={[
          { key: 'deportistaId', label: 'Deportista (UUID)', tipo: 'text', requerido: true, patron: UUID_RE, mensajeInvalido: UUID_MSG, ayuda: 'Pega el UUID del deportista desde un registro existente.' },
          { key: 'plantillaRutinaId', label: 'Plantilla', tipo: 'select', opciones: (plantillas.datos ?? []).map((t) => ({ value: t.id, label: t.nombrePlantilla })) },
          { key: 'objetivo', label: 'Objetivo', tipo: 'select', requerido: true, opciones: OBJETIVO_PLAN, ancho: 'half' },
          { key: 'estado', label: 'Estado', tipo: 'select', requerido: true, opciones: ESTADO_PLAN_ENTRENAMIENTO, ancho: 'half' },
          { key: 'fechaInicio', label: 'Fecha inicio', tipo: 'date', requerido: true, ancho: 'half' },
          { key: 'fechaFin', label: 'Fecha fin', tipo: 'date', requerido: true, ancho: 'half' },
          { key: 'generadoPorIA', label: 'Generado por IA', tipo: 'select', requerido: true, opciones: SI_NO },
        ]}
        aValores={(p) => ({ deportistaId: p.deportistaId, plantillaRutinaId: p.plantillaRutinaId ?? '', objetivo: p.objetivo, estado: p.estado, fechaInicio: p.fechaInicio, fechaFin: p.fechaFin, generadoPorIA: String(p.generadoPorIA) })}
        crear={(v) => aiPlanes.crear(planEntrenoBody(v))}
        actualizar={(id, v) => aiPlanes.actualizar(id, planEntrenoBody(v))}
        eliminar={(id) => aiPlanes.eliminar(id)}
        reporte={{ pdf: aiPlanes.reportePdf, excel: aiPlanes.reporteExcel }}
      />

      <CrudSection<EjercicioResponse>
        titulo="Ejercicios"
        entidad="Ejercicio"
        datos={ejercicios}
        puedeGestionar={esAdministrador}
        illustration="plan"
        emptyTitle="Sin ejercicios"
        emptyBody="Crea ejercicios con grupo muscular, categoría y dificultad."
        idDe={(e) => e.id}
        pageSize={6}
        columnas={[
          { key: 'nombre', header: 'Ejercicio' },
          { key: 'grupo', header: 'Grupo' },
          { key: 'categoria', header: 'Categoría' },
          { key: 'dificultad', header: 'Dificultad' },
        ]}
        fila={(e) => ({
          nombre: e.nombreEjercicio,
          grupo: estadoVisual(e.grupoMuscular).etiqueta,
          categoria: estadoVisual(e.categoria).etiqueta,
          dificultad: estadoVisual(e.dificultad).etiqueta,
        })}
        campos={[
          { key: 'nombreEjercicio', label: 'Nombre', tipo: 'text', requerido: true },
          { key: 'grupoMuscular', label: 'Grupo muscular', tipo: 'select', requerido: true, opciones: GRUPO_MUSCULAR, ancho: 'half' },
          { key: 'categoria', label: 'Categoría', tipo: 'select', requerido: true, opciones: CATEGORIA_EJERCICIO, ancho: 'half' },
          { key: 'dificultad', label: 'Dificultad', tipo: 'select', requerido: true, opciones: DIFICULTAD, ancho: 'half' },
          { key: 'tipoEjercicio', label: 'Tipo', tipo: 'select', requerido: true, opciones: TIPO_EJERCICIO, ancho: 'half' },
          { key: 'descripcionEjercicio', label: 'Descripción', tipo: 'textarea' },
          { key: 'equipamiento', label: 'Equipamiento', tipo: 'text' },
        ]}
        aValores={(e) => ({ nombreEjercicio: e.nombreEjercicio, grupoMuscular: e.grupoMuscular, categoria: e.categoria, dificultad: e.dificultad, tipoEjercicio: e.tipoEjercicio, descripcionEjercicio: e.descripcionEjercicio ?? '', equipamiento: e.equipamiento ?? '' })}
        crear={(v) => aiEjercicios.crear({ nombreEjercicio: v.nombreEjercicio, grupoMuscular: v.grupoMuscular as CreateEjercicioRequest['grupoMuscular'], categoriaEjercicio: v.categoria as CreateEjercicioRequest['categoriaEjercicio'], dificultadEjercicio: v.dificultad as CreateEjercicioRequest['dificultadEjercicio'], tipoEjercicio: v.tipoEjercicio as CreateEjercicioRequest['tipoEjercicio'], descripcionEjercicio: v.descripcionEjercicio || undefined, equipamiento: v.equipamiento || undefined })}
        actualizar={(id, v) => aiEjercicios.actualizar(id, { nombreEjercicio: v.nombreEjercicio, grupoMuscular: v.grupoMuscular as CreateEjercicioRequest['grupoMuscular'], categoria: v.categoria as CreateEjercicioRequest['categoriaEjercicio'], dificultad: v.dificultad as CreateEjercicioRequest['dificultadEjercicio'], tipoEjercicio: v.tipoEjercicio as CreateEjercicioRequest['tipoEjercicio'], descripcionEjercicio: v.descripcionEjercicio || undefined, equipamiento: v.equipamiento || undefined })}
        eliminar={(id) => aiEjercicios.eliminar(id)}
        reporte={{ pdf: aiEjercicios.reportePdf, excel: aiEjercicios.reporteExcel }}
      />

      <CrudSection<PlantillaRutinaResponse>
        titulo="Plantillas de rutina"
        entidad="Plantilla"
        datos={plantillas}
        puedeGestionar={esAdministrador}
        illustration="plan"
        emptyTitle="Sin plantillas"
        emptyBody="Crea plantillas reutilizables por objetivo y dificultad."
        idDe={(t) => t.id}
        pageSize={6}
        columnas={[
          { key: 'nombre', header: 'Plantilla' },
          { key: 'objetivo', header: 'Objetivo' },
          { key: 'dificultad', header: 'Dificultad' },
          { key: 'activo', header: 'Activo' },
        ]}
        fila={(t) => ({
          nombre: t.nombrePlantilla,
          objetivo: t.objetivo ? estadoVisual(t.objetivo).etiqueta : '—',
          dificultad: t.dificultad ? estadoVisual(t.dificultad).etiqueta : '—',
          activo: <StatusBadge tone={t.activo ? 'success' : 'neutral'} label={t.activo ? 'Activo' : 'Inactivo'} />,
        })}
        campos={[
          { key: 'nombrePlantilla', label: 'Nombre', tipo: 'text', requerido: true },
          { key: 'objetivo', label: 'Objetivo', tipo: 'select', opciones: OBJETIVO_PLAN, ancho: 'half' },
          { key: 'dificultad', label: 'Dificultad', tipo: 'select', opciones: DIFICULTAD, ancho: 'half' },
          { key: 'duracionEstimadaMinutos', label: 'Duración (min)', tipo: 'number', min: 0, ancho: 'half' },
          { key: 'activo', label: 'Activa', tipo: 'select', opciones: SI_NO, ancho: 'half' },
          { key: 'descripcionPlantilla', label: 'Descripción', tipo: 'textarea' },
        ]}
        aValores={(t) => ({ nombrePlantilla: t.nombrePlantilla, objetivo: t.objetivo ?? '', dificultad: t.dificultad ?? '', duracionEstimadaMinutos: t.duracionEstimadaMinutos ? String(t.duracionEstimadaMinutos) : '', activo: String(t.activo), descripcionPlantilla: t.descripcionPlantilla ?? '' })}
        crear={(v) => aiPlantillas.crear(plantillaBody(v))}
        actualizar={(id, v) => aiPlantillas.actualizar(id, plantillaBody(v))}
        eliminar={(id) => aiPlantillas.eliminar(id)}
        reporte={{ pdf: aiPlantillas.reportePdf, excel: aiPlantillas.reporteExcel }}
      />
    </div>
  )

  const aprobacionesTab = (
    <CrudSection<GymApprovalResponse>
      titulo="Aprobaciones de gimnasio"
      entidad="Aprobación"
      datos={aprobaciones}
      puedeGestionar={false}
      illustration="plan"
      emptyTitle="Sin aprobaciones"
      emptyBody="Las autorizaciones médicas para uso del gimnasio aparecerán aquí."
      idDe={(a) => a.id}
      columnas={[
        { key: 'deportista', header: 'Deportista' },
        { key: 'tipo', header: 'Restricción' },
        { key: 'medico', header: 'Médico' },
        { key: 'estado', header: 'Estado' },
        { key: 'expira', header: 'Expira', align: 'end' },
      ]}
      fila={(a) => ({
        deportista: a.deportistaId,
        tipo: estadoVisual(a.tipoRestriccion).etiqueta,
        medico: a.medicoId,
        estado: <StatusBadge tone={estadoVisual(a.estado).tono} label={estadoVisual(a.estado).etiqueta} />,
        expira: a.fechaExpiracion ? new Date(a.fechaExpiracion).toLocaleDateString('es-EC') : 'Sin expiración',
      })}
      campos={[]}
      reporte={{ pdf: gymApprovals.reportePdf, excel: gymApprovals.reporteExcel }}
    />
  )

  return (
    <>
      <PageHeader
        title="Planes y revisiones"
        lead="Nutrición, prescripción de entrenamiento y aprobaciones médicas, con datos reales del backend."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Atención deportiva' },
          { label: 'Planes y revisiones' },
        ]}
      />

      <Tabs
        tabs={[
          { id: 'nutricion', label: 'Nutrición', content: nutricion },
          { id: 'prescripcion', label: 'Prescripción', content: prescripcion },
          { id: 'aprobaciones', label: 'Aprobaciones', content: aprobacionesTab },
        ]}
      />
    </>
  )
}

function planEntrenoBody(v: ValoresForm): CreatePlanEntrenamientoRequest {
  return {
    deportistaId: v.deportistaId,
    plantillaRutinaId: v.plantillaRutinaId || undefined,
    generadoPorIA: v.generadoPorIA === 'true',
    objetivo: v.objetivo as CreatePlanEntrenamientoRequest['objetivo'],
    fechaInicio: v.fechaInicio,
    fechaFin: v.fechaFin,
    estado: v.estado as CreatePlanEntrenamientoRequest['estado'],
  }
}

function plantillaBody(v: ValoresForm): CreatePlantillaRutinaRequest {
  return {
    nombrePlantilla: v.nombrePlantilla,
    descripcionPlantilla: v.descripcionPlantilla || undefined,
    objetivo: (v.objetivo || undefined) as CreatePlantillaRutinaRequest['objetivo'],
    dificultad: (v.dificultad || undefined) as CreatePlantillaRutinaRequest['dificultad'],
    duracionEstimadaMinutos: v.duracionEstimadaMinutos ? Number(v.duracionEstimadaMinutos) : undefined,
    activo: v.activo ? v.activo === 'true' : undefined,
  }
}
