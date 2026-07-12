import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { FilterBar } from '../../components/data-display/FilterBar'
import { SearchField } from '../../components/forms/SearchField'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { useDrafts } from '../../services/drafts/useDrafts'
import { NuevoDeportistaModal } from './NuevoDeportistaModal'
import { useApiData } from '../../services/api/useApiData'
import { clinicalEvaluations } from '../../services/api/endpoints'

/* Deportistas y expediente: contexto clínico calmado, sin decoración,
   exposición mínima de datos de salud (AGENTS.md §15). */
export default function DeportistasPage() {
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const { deportistas } = useDrafts()
  const evaluaciones = useApiData(() => clinicalEvaluations.listar())

  const filtro = busqueda.trim().toLowerCase()
  const filasBackend = Array.from(
    new Map((evaluaciones.datos ?? []).map((e) => [e.deportistaId, e])).values(),
  ).map((e) => ({
    nombre: e.deportistaId,
    programa: e.diagnostico,
    aptitud: <StatusBadge tone="success" label="Evaluado" icon="check" />,
    ultimaEvaluacion: new Date(e.fechaEvaluacion).toLocaleDateString('es-EC'),
    acciones: <StatusBadge tone="info" label={`RPE ${e.rpe ?? '—'}`} icon="pulso" />,
  }))
  const filasLocales = deportistas
    .filter((d) => !filtro || d.nombre.toLowerCase().includes(filtro))
    .map((d) => ({
      nombre: d.nombre,
      programa: d.programa,
      aptitud: <StatusBadge tone="neutral" label="Sin evaluación" icon="reloj" />,
      ultimaEvaluacion: 'Pendiente',
      acciones: <StatusBadge tone="neutral" label="Borrador local" icon="reloj" />,
    }))
  const filas = [...filasBackend, ...filasLocales].filter(
    (fila) => !filtro || fila.nombre.toLowerCase().includes(filtro),
  )

  return (
    <>
      <PageHeader
        title="Deportistas"
        lead="Perfil deportivo-sanitario, aptitud vigente y acceso al expediente. La información clínica se muestra solo a roles autorizados."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Atención deportiva' },
          { label: 'Deportistas' },
        ]}
        actions={
          <AppButton icon="mas" onClick={() => setModalAbierto(true)}>
            Nuevo deportista
          </AppButton>
        }
      />

      <ApiState estado={evaluaciones.estado} contract="Deportistas y expediente" error={evaluaciones.error} onRetry={evaluaciones.recargar} />

      <FilterBar label="Búsqueda de deportistas">
        <div>
          <span className="sg-field-label d-block">Buscar</span>
          <SearchField
            id="buscar-deportista"
            label="Buscar deportista por nombre"
            placeholder="Nombre del deportista"
            value={busqueda}
            onChange={setBusqueda}
          />
        </div>
      </FilterBar>

      <DataTable
        caption="Deportistas registrados con su estado de aptitud"
        columns={[
          { key: 'nombre', header: 'Deportista' },
          { key: 'programa', header: 'Programa' },
          { key: 'aptitud', header: 'Aptitud' },
          { key: 'ultimaEvaluacion', header: 'Última evaluación' },
          { key: 'acciones', header: 'Expediente', align: 'end' },
        ]}
        rows={filas}
        emptyState={
          <NoContractState
            illustration="riesgo"
            title="Aún no hay deportistas registrados"
            body="No existen evaluaciones clínicas ni borradores registrados."
            action={
              <AppButton size="sm" icon="mas" onClick={() => setModalAbierto(true)}>
                Nuevo deportista
              </AppButton>
            }
          />
        }
      />

      <NuevoDeportistaModal show={modalAbierto} onHide={() => setModalAbierto(false)} />
    </>
  )
}
