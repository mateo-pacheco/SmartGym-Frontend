import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { useDrafts } from '../../services/drafts/useDrafts'
import { CrearReservaModal } from './CrearReservaModal'

/* Agenda y aforo: prioriza disponibilidad, ocupación y prevención de
   conflictos. El calendario accesible llegará con el contrato real. */
export default function AgendaPage() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const { reservas } = useDrafts()

  const filas = reservas.map((r) => ({
    franja: `${r.fecha} · ${r.franja}`,
    zona: r.zona,
    deportista: r.deportista,
    ocupacion: 'N/D',
    estado: <StatusBadge tone="neutral" label="Borrador local" icon="reloj" />,
  }))

  return (
    <>
      <PageHeader
        title="Agenda y aforo"
        lead="Reservas, franjas horarias y capacidad por zona. Las reservas creadas quedan como borrador local hasta confirmar el contrato de agenda."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Operación' },
          { label: 'Agenda y aforo' },
        ]}
        actions={
          <AppButton icon="mas" onClick={() => setModalAbierto(true)}>
            Crear reserva
          </AppButton>
        }
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <DataTable
            caption="Reservas del día ordenadas por franja horaria"
            columns={[
              { key: 'franja', header: 'Franja' },
              { key: 'zona', header: 'Zona' },
              { key: 'deportista', header: 'Deportista' },
              { key: 'ocupacion', header: 'Ocupación', align: 'end' },
              { key: 'estado', header: 'Estado' },
            ]}
            rows={filas}
            emptyState={
              <NoContractState
                illustration="agenda"
                moduleName="La agenda"
                detail="Puedes crear borradores locales desde «Crear reserva»."
                contract="Reservas y aforo"
                expectedAction="reservar franjas, ver ocupación real y prevenir conflictos de capacidad."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <h2 className="fs-6 fw-semibold mb-3">Capacidad por zona</h2>
          <div className="sg-surface--inset p-3 d-grid gap-2">
            <StatusBadge tone="warning" label="Contrato requerido: Reservas y aforo" icon="reloj" />
            <p className="m-0" style={{ fontSize: '0.86rem', color: 'var(--sg-text-secondary)' }}>
              El aforo en tiempo real por zona (sala de fuerza, cardio, estudio XR, pista) aparecerá
              aquí con barras de ocupación accesibles y su equivalente textual.
            </p>
          </div>
        </div>
      </div>

      <CrearReservaModal show={modalAbierto} onHide={() => setModalAbierto(false)} />
    </>
  )
}
