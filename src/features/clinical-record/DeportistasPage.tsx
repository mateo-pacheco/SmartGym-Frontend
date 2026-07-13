import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { FilterBar } from '../../components/data-display/FilterBar'
import { SearchField } from '../../components/forms/SearchField'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { NuevoDeportistaModal } from './NuevoDeportistaModal'
import { useApiData } from '../../services/api/useApiData'
import { clinicalEvaluations } from '../../services/api/endpoints'

export default function DeportistasPage() {
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const evaluaciones = useApiData(() => clinicalEvaluations.listar())

  const filtro = busqueda.trim().toLowerCase()
  const filas = Array.from(
    new Map((evaluaciones.datos ?? []).map((evaluacion) => [evaluacion.deportistaId, evaluacion])).values(),
  )
    .map((evaluacion) => ({
      nombre: evaluacion.deportistaId,
      programa: evaluacion.diagnostico,
      aptitud: <StatusBadge tone="success" label="Evaluado" icon="check" />,
      ultimaEvaluacion: new Date(evaluacion.fechaEvaluacion).toLocaleDateString('es-EC'),
      acciones: <StatusBadge tone="info" label={`RPE ${evaluacion.rpe ?? '—'}`} icon="pulso" />,
    }))
    .filter((fila) => !filtro || fila.nombre.toLowerCase().includes(filtro))

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
          <AppButton icon="mas" onClick={() => setModalAbierto(true)} disabled={evaluaciones.estado !== 'listo'}>
            Nueva evaluación
          </AppButton>
        }
      />

      <ApiState
        estado={evaluaciones.estado}
        contract="Deportistas y expediente"
        error={evaluaciones.error}
        onRetry={evaluaciones.recargar}
      />

      <FilterBar label="Búsqueda de deportistas">
        <div>
          <span className="sg-field-label d-block">Buscar</span>
          <SearchField
            id="buscar-deportista"
            label="Buscar deportista por identificador"
            placeholder="ID del deportista"
            value={busqueda}
            onChange={setBusqueda}
          />
        </div>
      </FilterBar>

      <DataTable
        caption="Deportistas con evaluaciones clínicas registradas"
        columns={[
          { key: 'nombre', header: 'Deportista' },
          { key: 'programa', header: 'Diagnóstico' },
          { key: 'aptitud', header: 'Estado' },
          { key: 'ultimaEvaluacion', header: 'Última evaluación' },
          { key: 'acciones', header: 'Expediente', align: 'end' },
        ]}
        rows={filas}
        emptyState={
          <NoContractState
            illustration="riesgo"
            title="Aún no hay evaluaciones registradas"
            body="No existen evaluaciones clínicas registradas en el backend."
            action={
              <AppButton size="sm" icon="mas" onClick={() => setModalAbierto(true)}>
                Nueva evaluación
              </AppButton>
            }
          />
        }
      />

      <NuevoDeportistaModal
        show={modalAbierto}
        onHide={() => setModalAbierto(false)}
        onSaved={evaluaciones.recargar}
      />
    </>
  )
}
