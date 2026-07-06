import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import { PageHeader } from '../../components/navigation/PageHeader'
import { FilterBar } from '../../components/data-display/FilterBar'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'

/* Auditoría: tabla primero, orientada al tiempo, sin fotos ni animación
   de scroll (AGENTS.md §15). */
export default function AuditoriaPage() {
  const [tipo, setTipo] = useState('todos')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')

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

      <DataTable
        caption="Eventos de auditoría en orden cronológico descendente"
        columns={[
          { key: 'fecha', header: 'Fecha y hora' },
          { key: 'actor', header: 'Actor' },
          { key: 'accion', header: 'Acción' },
          { key: 'recurso', header: 'Recurso' },
          { key: 'resultado', header: 'Resultado' },
        ]}
        rows={[]}
        emptyState={
          <NoContractState
            illustration="auditoria"
            moduleName="El registro de auditoría"
            detail="Cada evento incluirá actor, acción, recurso y resultado, sin exponer identificadores sensibles."
            contract="Auditoría del sistema"
            expectedAction="reconstruir cualquier decisión operativa o clínica por fecha y actor."
          />
        }
      />
    </>
  )
}
