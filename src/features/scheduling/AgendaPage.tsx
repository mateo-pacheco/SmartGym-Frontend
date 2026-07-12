import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ModuleGate } from '../../components/feedback/ModuleGate'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { useDrafts } from '../../services/drafts/useDrafts'
import { CrearReservaModal } from './CrearReservaModal'

const ZONAS = ['Sala de fuerza', 'Cardio', 'Estudio XR', 'Pista'] as const

/* Agenda y aforo: prioriza disponibilidad, ocupación y prevención de
   conflictos. El calendario accesible llegará con el contrato real. */
export default function AgendaPage() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const { reservas } = useDrafts()

  const filas = reservas.map((r) => ({
    franja: `${r.fecha} · ${r.franja}`,
    zona: r.zona,
    deportista: r.deportista,
    ocupacion: '—',
    estado: <StatusBadge tone="neutral" label="Borrador local" icon="reloj" />,
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
          <AppButton icon="mas" onClick={() => setModalAbierto(true)}>
            Crear reserva
          </AppButton>
        }
      />

      <ModuleGate contract="Reservas y aforo" />

      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="sg-section-title">Reservas del día</h2>
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
                title="Aún no hay reservas"
                body="Crea un borrador local mientras el módulo se conecta al backend."
                action={
                  <AppButton size="sm" icon="mas" onClick={() => setModalAbierto(true)}>
                    Crear reserva
                  </AppButton>
                }
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
            <h2 className="sg-section-title">Capacidad por zona</h2>
            <dl className="sg-deflist sg-surface--inset p-3">
              {ZONAS.map((zona) => (
                <div key={zona}>
                  <dt>{zona}</dt>
                  <dd className="sg-metric__value--empty">—</dd>
                </div>
              ))}
            </dl>
            <p className="sg-note sg-note--muted mt-2">
              La ocupación en tiempo real incluirá barras accesibles con su equivalente textual.
            </p>
          </MotionEffect>
        </div>
      </div>

      <CrearReservaModal show={modalAbierto} onHide={() => setModalAbierto(false)} />
    </>
  )
}
