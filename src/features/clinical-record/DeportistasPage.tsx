import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { FilterBar } from '../../components/data-display/FilterBar'
import { SearchField } from '../../components/forms/SearchField'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ModuleGate } from '../../components/feedback/ModuleGate'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { useDrafts } from '../../services/drafts/useDrafts'
import { NuevoDeportistaModal } from './NuevoDeportistaModal'

/* Deportistas y expediente: contexto clínico calmado, sin decoración,
   exposición mínima de datos de salud (AGENTS.md §15). */
export default function DeportistasPage() {
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const { deportistas } = useDrafts()

  const filtro = busqueda.trim().toLowerCase()
  const filas = deportistas
    .filter((d) => !filtro || d.nombre.toLowerCase().includes(filtro))
    .map((d) => ({
      nombre: d.nombre,
      programa: d.programa,
      aptitud: <StatusBadge tone="neutral" label="Sin evaluación" icon="reloj" />,
      ultimaEvaluacion: 'Pendiente',
      acciones: <StatusBadge tone="neutral" label="Borrador local" icon="reloj" />,
    }))

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

      <ModuleGate contract="Deportistas y expediente" />

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
            body="Crea un borrador local mientras el módulo se conecta al backend."
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
