import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import { PageHeader } from '../../components/navigation/PageHeader'
import { FilterBar } from '../../components/data-display/FilterBar'
import { SearchField } from '../../components/forms/SearchField'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { useDrafts } from '../../services/drafts/useDrafts'
import { useApiData } from '../../services/api/useApiData'
import { accesosNfc } from '../../services/api/endpoints'
import { RegistrarManillaModal } from './RegistrarManillaModal'

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' })

/* Acceso NFC: tabla primero, sin fotos ni scroll animation (AGENTS.md §15).
   Nunca se muestran valores NFC, HMAC ni credenciales. */
export default function AccesosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('todos')
  const [modalAbierto, setModalAbierto] = useState(false)
  const { manillas } = useDrafts()
  const accesos = useApiData(() => accesosNfc.consultar({ size: 25 }))

  const filtro = busqueda.trim().toLowerCase()
  const filas = manillas
    .filter((m) => !filtro || m.deportista.toLowerCase().includes(filtro) || m.identificador.toLowerCase().includes(filtro))
    .filter(() => estado === 'todos' || estado === 'borrador')
    .map((m) => ({
      deportista: m.deportista,
      identificador: m.identificador,
      estado: <StatusBadge tone="neutral" label="Borrador local" icon="reloj" />,
      ultimoAcceso: 'Sin actividad',
      acciones: <span className="sg-note--muted">Se habilita con el contrato</span>,
    }))

  return (
    <>
      <PageHeader
        title="Acceso NFC"
        lead="Manillas registradas, intentos de acceso y bloqueos del ecosistema."
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

      <ApiState
        estado={accesos.estado}
        contract="Manillas y accesos NFC"
        error={accesos.error}
        onRetry={accesos.recargar}
      />

      {accesos.estado === 'listo' && accesos.datos ? (
        <section aria-label="Historial de accesos NFC" className="mb-4">
          <h2 className="sg-section-title">
            Actividad de accesos
            <span className="sg-note--muted ms-2">
              {accesos.datos.totalElements} registros
            </span>
          </h2>
          <DataTable
            caption="Últimos accesos NFC validados por el servidor"
            columns={[
              { key: 'deportista', header: 'Deportista' },
              { key: 'maquina', header: 'Máquina' },
              { key: 'resultado', header: 'Resultado' },
              { key: 'fecha', header: 'Fecha y hora' },
              { key: 'latencia', header: 'Latencia', align: 'end' },
            ]}
            rows={accesos.datos.content.map((a) => ({
              deportista: a.deportistaId,
              maquina: a.maquinaId,
              resultado:
                a.resultado === 'EXITOSO' ? (
                  <StatusBadge tone="success" label="Exitoso" icon="check" />
                ) : (
                  <StatusBadge tone="danger" label="Fallido" />
                ),
              fecha: formatearFecha(a.fechaHoraServidor),
              latencia: `${a.tiempoRespuestaMs} ms`,
            }))}
            emptyState={
              <NoContractState
                illustration="nfc"
                title="Sin accesos registrados"
                body="El backend está conectado; los accesos aparecerán aquí en cuanto ocurran."
              />
            }
          />
        </section>
      ) : null}

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
            title="Aún no hay manillas registradas"
            body="Crea un borrador local mientras el módulo se conecta al backend."
            action={
              <AppButton size="sm" icon="mas" onClick={() => setModalAbierto(true)}>
                Registrar manilla
              </AppButton>
            }
          />
        }
      />

      <section aria-label="Estados del ciclo de vida de una manilla" className="mt-4">
        <h2 className="sg-section-title mb-2">Estados del ciclo de vida</h2>
        <div className="d-flex flex-wrap gap-2">
          <StatusBadge tone="success" label="Activa" />
          <StatusBadge tone="warning" label="En reposición" icon="reloj" />
          <StatusBadge tone="danger" label="Bloqueada" icon="privacidad" />
          <StatusBadge tone="neutral" label="Borrador local" icon="reloj" />
        </div>
        <p className="sg-note mt-2">
          Bloquear o revocar una manilla es una acción irreversible: requerirá confirmación
          explícita con la consecuencia descrita antes de ejecutarse.
        </p>
      </section>

      <RegistrarManillaModal show={modalAbierto} onHide={() => setModalAbierto(false)} />
    </>
  )
}
