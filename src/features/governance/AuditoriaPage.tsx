import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import { BotonesReporte } from '../../components/actions/BotonesReporte'
import { PageHeader } from '../../components/navigation/PageHeader'
import { FilterBar } from '../../components/data-display/FilterBar'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { useApiData } from '../../services/api/useApiData'
import { accesosNfc } from '../../services/api/endpoints'

/* Auditoría: tabla primero, orientada al tiempo, sin fotos ni animación
   de scroll (AGENTS.md §15). */
export default function AuditoriaPage() {
  const [tipo, setTipo] = useState('todos')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const auditorias = useApiData(() => accesosNfc.auditoriasManillas({ size: 50 }))
  const filas = (auditorias.datos?.content ?? [])
    .filter(() => tipo === 'todos' || tipo === 'acceso')
    .filter((a) => !desde || a.fechaHora.slice(0, 10) >= desde)
    .filter((a) => !hasta || a.fechaHora.slice(0, 10) <= hasta)
    .map((a) => ({
      fecha: new Date(a.fechaHora).toLocaleString('es-EC'),
      actor: a.actorTipo,
      accion: a.accion,
      recurso: a.manillaId,
      resultado: a.detalle,
    }))

  return (
    <>
      <PageHeader
        title="Auditoría"
        lead="Registro cronológico e inmutable de acciones del sistema: quién hizo qué, cuándo y sobre qué recurso."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Administración' },
          { label: 'Auditoría' },
        ]}
      />

      <ApiState estado={auditorias.estado} contract="Auditoría del sistema" error={auditorias.error} onRetry={auditorias.recargar} />

      <FilterBar label="Filtros de auditoría">
        <Form.Group controlId="auditoria-desde">
          <Form.Label className="sg-field-label">Desde</Form.Label>
          <Form.Control type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="auditoria-hasta">
          <Form.Label className="sg-field-label">Hasta</Form.Label>
          <Form.Control type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="auditoria-tipo">
          <Form.Label className="sg-field-label">Tipo de evento</Form.Label>
          <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="todos">Todos los eventos</option>
            <option value="acceso">Accesos NFC</option>
            <option value="clinico">Expediente clínico</option>
            <option value="planes">Planes y revisiones</option>
            <option value="seguridad">Seguridad y roles</option>
          </Form.Select>
        </Form.Group>
      </FilterBar>

      <div className="d-flex justify-content-end mb-2">
        <BotonesReporte
          pdf={accesosNfc.reporteAuditoriasPdf}
          excel={accesosNfc.reporteAuditoriasExcel}
          disabled={auditorias.estado !== 'listo'}
        />
      </div>

      <DataTable
        caption="Eventos de auditoría en orden cronológico descendente"
        columns={[
          { key: 'fecha', header: 'Fecha y hora' },
          { key: 'actor', header: 'Actor' },
          { key: 'accion', header: 'Acción' },
          { key: 'recurso', header: 'Recurso' },
          { key: 'resultado', header: 'Resultado' },
        ]}
        rows={filas}
        emptyState={
          <NoContractState
            illustration="auditoria"
            title="Aún no hay eventos de auditoría"
            body="Cada evento incluirá actor, acción, recurso y resultado, sin exponer identificadores sensibles."
          />
        }
      />
    </>
  )
}
