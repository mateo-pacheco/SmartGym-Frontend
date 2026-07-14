import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog'
import { CrearReservaModal } from './CrearReservaModal'
import { useToast } from '../../app/providers/useToast'
import { useApiData } from '../../services/api/useApiData'
import { useAuth } from '../../services/api/useAuth'
import { useMutation } from '../../services/api/useMutation'
import { agendamiento } from '../../services/api/endpoints'
import { estadoVisual } from '../../lib/estadoVisual'
import type { ReservaResponseDTO } from '../../services/api/types'

export default function AgendaPage() {
  const { id: sesionId } = useAuth()
  const { showToast } = useToast()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [misReservas, setMisReservas] = useState<ReservaResponseDTO[]>([])
  const [aCancelar, setACancelar] = useState<ReservaResponseDTO | null>(null)

  const espacios = useApiData(() => agendamiento.listarEspacios())
  const cancelar = useMutation((id: string, usuarioId: string) => agendamiento.cancelarReserva(id, usuarioId))

  const filas = (espacios.datos ?? []).map((espacio) => ({
    zona: espacio.nombre,
    tipo: estadoVisual(espacio.tipo).etiqueta,
    capacidad: `${espacio.capacidadMaxima} personas`,
    estado: <StatusBadge tone="success" label="Disponible" icon="check" />,
  }))

  const confirmarCancelar = async () => {
    if (!aCancelar || !sesionId) return
    try {
      await cancelar.ejecutar(aCancelar.id, sesionId)
      showToast({ title: 'Reserva cancelada', body: 'La reserva se canceló y el cupo se liberó en el backend.' })
      setMisReservas((rs) => rs.filter((r) => r.id !== aCancelar.id))
      setACancelar(null)
    } catch {
      /* error mostrado en el diálogo */
    }
  }

  return (
    <>
      <PageHeader
        title="Agenda y aforo"
        lead="Reservas, franjas horarias y capacidad por zona, con cupos reales del backend."
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

      <ApiState estado={espacios.estado} contract="Reservas y aforo" error={espacios.error} onRetry={espacios.recargar} />

      {misReservas.length > 0 ? (
        <section aria-label="Mis reservas" className="mb-4">
          <h2 className="sg-section-title">Mis reservas de esta sesión</h2>
          <DataTable
            caption="Reservas creadas en esta sesión, con opción de cancelar"
            columns={[
              { key: 'reserva', header: 'Reserva' },
              { key: 'tipo', header: 'Tipo' },
              { key: 'estado', header: 'Estado' },
              { key: 'acciones', header: '', align: 'end' },
            ]}
            rows={misReservas.map((r) => ({
              reserva: r.id.slice(0, 8),
              tipo: estadoVisual(r.tipo).etiqueta,
              estado: <StatusBadge tone={estadoVisual(r.estado).tono} label={estadoVisual(r.estado).etiqueta} />,
              acciones: <AppButton variant="ghost" size="sm" icon="basura" onClick={() => setACancelar(r)}>Cancelar</AppButton>,
            }))}
            emptyState={<p className="sg-note--muted p-3 m-0">Sin reservas en esta sesión.</p>}
          />
        </section>
      ) : null}

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
                body="El backend respondió correctamente, pero aún no existen espacios para reservar."
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
              Al crear una reserva, las franjas y cupos se consultan directamente en el backend. No se permiten fechas pasadas ni franjas sin cupo.
            </p>
          </MotionEffect>
        </div>
      </div>

      <CrearReservaModal
        show={modalAbierto}
        onHide={() => setModalAbierto(false)}
        espacios={espacios.datos ?? []}
        onSaved={(reserva) => {
          setMisReservas((rs) => [reserva, ...rs])
          espacios.recargar()
        }}
      />

      <ConfirmDialog
        show={!!aCancelar}
        title="Cancelar reserva"
        body={<>Se cancelará la reserva y el cupo volverá a estar disponible. Esta acción no se puede deshacer.{cancelar.error ? <span className="text-danger d-block mt-2">{cancelar.error}</span> : null}</>}
        confirmLabel="Cancelar reserva"
        cancelLabel="Volver"
        danger
        busy={cancelar.enviando}
        onConfirm={confirmarCancelar}
        onCancel={() => setACancelar(null)}
      />
    </>
  )
}
