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
import { useApiData } from '../../services/api/useApiData'
import { accesosNfc } from '../../services/api/endpoints'
import { getSesion } from '../../services/api/auth'
import type { ManillaNfcResponseDTO } from '../../services/api/types'
import { RegistrarManillaModal } from './RegistrarManillaModal'

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' })

export default function AccesosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('todos')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [registradas, setRegistradas] = useState<ManillaNfcResponseDTO[]>([])
  const accesos = useApiData(() => accesosNfc.consultar({ size: 50 }))

  const filtro = busqueda.trim().toLowerCase()
  const accesosPorManilla = new Map(
    (accesos.datos?.content ?? []).map((acceso) => [acceso.manillaId, acceso]),
  )
  const manillasConActividad = Array.from(accesosPorManilla.values()).map((acceso) => ({
    id: acceso.manillaId,
    deportistaId: acceso.deportistaId,
    identificador: `•••• ${acceso.manillaId.slice(-8)}`,
    estado: 'REGISTRADA',
    ultimoAcceso: formatearFecha(acceso.fechaHoraServidor),
  }))
  const manillasNuevas = registradas.map((manilla) => ({
    id: manilla.id,
    deportistaId: manilla.deportistaId,
    identificador: manilla.codigoNfcMascara,
    estado: manilla.estado,
    ultimoAcceso: 'Sin actividad',
  }))
  const filas = [
    ...manillasNuevas,
    ...manillasConActividad.filter((m) => !registradas.some((n) => n.id === m.id)),
  ]
    .filter(
      (m) =>
        !filtro ||
        m.deportistaId.toLowerCase().includes(filtro) ||
        m.identificador.toLowerCase().includes(filtro),
    )
    .filter((m) => estado === 'todos' || m.estado.toLowerCase().includes(estado))
    .map((m) => ({
      deportista: m.deportistaId,
      identificador: m.identificador,
      estado: (
        <StatusBadge
          tone="success"
          label={m.estado === 'REGISTRADA' ? 'Registrada' : m.estado}
          icon="check"
        />
      ),
      ultimoAcceso: m.ultimoAcceso,
      acciones: <span className="sg-note--muted">Sincronizada</span>,
    }))

  const sesionId = getSesion()?.id
  const deportistaIds = Array.from(
    new Set([
      ...(accesos.datos?.content ?? []).map((acceso) => acceso.deportistaId),
      ...(sesionId ? [sesionId] : []),
    ]),
  )

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
            <AppButton variant="secondary" icon="exportar" disabled title="Exportación no disponible en este prototipo">
              Exportar actividad
            </AppButton>
            <AppButton icon="mas" onClick={() => setModalAbierto(true)} disabled={accesos.estado !== 'listo'}>
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
            <span className="sg-note--muted ms-2">{accesos.datos.totalElements} registros</span>
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
                body="Los accesos aparecerán aquí en cuanto una manilla sea validada."
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
            <option value="activa">Activa</option>
            <option value="registrada">Registrada</option>
            <option value="bloqueada">Bloqueada</option>
            <option value="reposicion">En reposición</option>
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
        caption="Manillas NFC sincronizadas. Los identificadores sensibles nunca se muestran en pantalla."
        columns={[
          { key: 'deportista', header: 'Deportista' },
          { key: 'identificador', header: 'Identificador público' },
          { key: 'estado', header: 'Estado' },
          { key: 'ultimoAcceso', header: 'Último acceso' },
          { key: 'acciones', header: 'Sincronización', align: 'end' },
        ]}
        rows={filas}
        emptyState={
          <NoContractState
            illustration="nfc"
            title="Aún no hay manillas registradas"
            body="Registra una manilla para habilitar la validación de accesos en el backend."
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
          <StatusBadge tone="neutral" label="Revocada" icon="privacidad" />
        </div>
        <p className="sg-note mt-2">
          Bloquear o revocar una manilla requiere confirmación explícita antes de ejecutarse.
        </p>
      </section>

      <RegistrarManillaModal
        show={modalAbierto}
        onHide={() => setModalAbierto(false)}
        deportistaIds={deportistaIds}
        onSaved={(manilla) => {
          setRegistradas((actuales) => [manilla, ...actuales])
          accesos.recargar()
        }}
      />
    </>
  )
}
