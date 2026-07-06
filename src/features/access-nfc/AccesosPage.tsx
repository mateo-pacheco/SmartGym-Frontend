import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import { PageHeader } from '../../components/navigation/PageHeader'
import { FilterBar } from '../../components/data-display/FilterBar'
import { SearchField } from '../../components/forms/SearchField'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { useDrafts } from '../../services/drafts/useDrafts'
import { RegistrarManillaModal } from './RegistrarManillaModal'

/* Acceso NFC: tabla primero, sin fotos ni scroll animation (AGENTS.md §15).
   Nunca se muestran valores NFC, HMAC ni credenciales. */
export default function AccesosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('todos')
  const [modalAbierto, setModalAbierto] = useState(false)
  const { manillas } = useDrafts()

  const filtro = busqueda.trim().toLowerCase()
  const filas = manillas
    .filter((m) => !filtro || m.deportista.toLowerCase().includes(filtro) || m.identificador.toLowerCase().includes(filtro))
    .filter(() => estado === 'todos' || estado === 'borrador')
    .map((m) => ({
      deportista: m.deportista,
      identificador: m.identificador,
      estado: <StatusBadge tone="neutral" label="Borrador local" icon="reloj" />,
      ultimoAcceso: 'Sin actividad',
      acciones: (
        <span className="sg-empty__hint">Se habilita con el contrato</span>
      ),
    }))

  return (
    <>
      <PageHeader
        title="Acceso NFC"
        lead="Manillas registradas, intentos de acceso y bloqueos. El alta guarda borradores locales hasta que el contrato del módulo esté confirmado."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Operación' },
          { label: 'Acceso NFC' },
        ]}
        actions={
          <>
            <AppButton variant="secondary" icon="exportar" disabled title="Se habilita con datos reales del contrato de accesos">
              Exportar actividad
            </AppButton>
            <AppButton icon="mas" onClick={() => setModalAbierto(true)}>
              Registrar manilla
            </AppButton>
          </>
        }
      />

      <FilterBar label="Filtros de manillas">
        <div>
          <span className="sg-field-label d-block">Buscar</span>
          <SearchField
            id="buscar-manilla"
            label="Buscar por deportista o identificador público"
            placeholder="Deportista o identificador"
            value={busqueda}
            onChange={setBusqueda}
          />
        </div>
        <Form.Group controlId="filtro-estado-manilla">
          <Form.Label className="sg-field-label">Estado</Form.Label>
          <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            <option value="borrador">Borrador local</option>
            <option value="activa">Activa</option>
            <option value="bloqueada">Bloqueada</option>
            <option value="en-reposicion">En reposición</option>
          </Form.Select>
        </Form.Group>
        <AppButton
          variant="tertiary"
          size="sm"
          className="align-self-end"
          onClick={() => {
            setBusqueda('')
            setEstado('todos')
          }}
        >
          Restablecer filtros
        </AppButton>
      </FilterBar>

      <DataTable
        caption="Manillas NFC registradas. Los identificadores sensibles nunca se muestran en pantalla."
        columns={[
          { key: 'deportista', header: 'Deportista' },
          { key: 'identificador', header: 'Identificador público' },
          { key: 'estado', header: 'Estado' },
          { key: 'ultimoAcceso', header: 'Último acceso' },
          { key: 'acciones', header: 'Acciones', align: 'end' },
        ]}
        rows={filas}
        emptyState={
          <NoContractState
            illustration="nfc"
            moduleName="El registro de manillas"
            detail="Puedes crear borradores locales desde «Registrar manilla»."
            contract="Manillas y accesos NFC"
            expectedAction="alta, bloqueo, reposición guiada y trazabilidad de intentos."
          />
        }
      />

      <section aria-label="Taxonomía de estados de manilla" className="mt-4">
        <h2 className="fs-6 fw-semibold mb-2">Estados del ciclo de vida</h2>
        <div className="d-flex flex-wrap gap-2">
          <StatusBadge tone="success" label="Activa" />
          <StatusBadge tone="warning" label="En reposición" icon="reloj" />
          <StatusBadge tone="danger" label="Bloqueada" icon="privacidad" />
          <StatusBadge tone="neutral" label="Borrador local" icon="reloj" />
        </div>
        <p className="mt-2 mb-0" style={{ fontSize: '0.83rem', color: 'var(--sg-text-secondary)' }}>
          Bloquear o revocar una manilla es una acción irreversible: requerirá confirmación
          explícita con la consecuencia descrita antes de ejecutarse.
        </p>
      </section>

      <RegistrarManillaModal show={modalAbierto} onHide={() => setModalAbierto(false)} />
    </>
  )
}
