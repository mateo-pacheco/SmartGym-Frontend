import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { CrearReservaModal } from './CrearReservaModal'
import { useApiData } from '../../services/api/useApiData'
import { agendamiento } from '../../services/api/endpoints'

export default function AgendaPage() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const espacios = useApiData(() => agendamiento.listarEspacios())

  const filas = (espacios.datos ?? []).map((espacio) => ({
    zona: espacio.nombre,
    tipo: espacio.tipo.replace(/_/g, ' '),
    capacidad: `${espacio.capacidadMaxima} personas`,
    estado: <StatusBadge tone="success" label="Disponible para agenda" icon="check" />,
  }))

  return (
    <>
      <PageHeader
        title="Agenda y aforo"
        lead="Reservas, franjas horarias y capacidad por zona."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Operación' },
          { label: 'Agenda y aforo' },
        ]}
        actions={
          <AppButton icon="mas" onClick={() => setModalAbierto(true)} disabled={espacios.estado !== 'listo'}>
            Crear reserva
          </AppButton>
        }
      />

      <ApiState
        estado={espacios.estado}
        contract="Reservas y aforo"
        error={espacios.error}
        onRetry={espacios.recargar}
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="sg-section-title">Zonas habilitadas para reserva</h2>
          <DataTable
            caption="Zonas y capacidades registradas en el servidor"
            columns={[
              { key: 'zona', header: 'Zona' },
              { key: 'tipo', header: 'Tipo' },
              { key: 'capacidad', header: 'Capacidad', align: 'end' },
              { key: 'estado', header: 'Estado' },
            ]}
            rows={filas}
            emptyState={
              <NoContractState
                illustration="agenda"
                title="No hay zonas configuradas"
                body="El backend respondió correctamente, pero todavía no existen espacios para reservar."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
            <h2 className="sg-section-title">Capacidad por zona</h2>
            <dl className="sg-deflist sg-surface--inset p-3">
              {(espacios.datos ?? []).map((espacio) => (
                <div key={espacio.id}>
                  <dt>{espacio.nombre}</dt>
                  <dd>{espacio.capacidadMaxima} personas</dd>
                </div>
              ))}
            </dl>
            <p className="sg-note sg-note--muted mt-2">
              Al crear una reserva, las franjas y cupos se consultan directamente en el backend.
            </p>
          </MotionEffect>
        </div>
      </div>

      <CrearReservaModal
        show={modalAbierto}
        onHide={() => setModalAbierto(false)}
        espacios={espacios.datos ?? []}
        onSaved={espacios.recargar}
      />
    </>
  )
}
