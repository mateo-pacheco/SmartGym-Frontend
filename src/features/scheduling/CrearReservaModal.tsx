import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AppButton } from '../../components/actions/AppButton'
import { useToast } from '../../app/providers/useToast'
import { agendamiento } from '../../services/api/endpoints'
import { getSesion } from '../../services/api/auth'
import { ApiError } from '../../services/api/http'
import type { EspacioZonaResponseDTO, ReservaResponseDTO, SlotHorarioResponseDTO } from '../../services/api/types'

interface Campos {
  fecha: string
  espacioId: string
  slotId: string
}

const hoy = () => new Date().toISOString().slice(0, 10)
const camposIniciales = (): Campos => ({ fecha: hoy(), espacioId: '', slotId: '' })

interface CrearReservaModalProps {
  show: boolean
  onHide: () => void
  espacios: EspacioZonaResponseDTO[]
  onSaved: (reserva: ReservaResponseDTO) => void
}

export function CrearReservaModal({ show, onHide, espacios, onSaved }: CrearReservaModalProps) {
  const [campos, setCampos] = useState<Campos>(camposIniciales)
  const [slots, setSlots] = useState<SlotHorarioResponseDTO[]>([])
  const [errores, setErrores] = useState<Partial<Campos>>({})
  const [cargandoSlots, setCargandoSlots] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (!show || !campos.fecha || !campos.espacioId) {
      setSlots([])
      return
    }
    let activo = true
    setCargandoSlots(true)
    setErrorApi(null)
    agendamiento
      .slots(campos.espacioId, campos.fecha)
      .then((datos) => {
        if (!activo) return
        setSlots(datos)
        setCampos((actual) => ({
          ...actual,
          slotId: datos.some((slot) => slot.id === actual.slotId) ? actual.slotId : '',
        }))
      })
      .catch((error: unknown) => {
        if (!activo) return
        setSlots([])
        setErrorApi(error instanceof ApiError ? error.message : 'No se pudieron consultar las franjas.')
      })
      .finally(() => activo && setCargandoSlots(false))
    return () => {
      activo = false
    }
  }, [show, campos.fecha, campos.espacioId])

  const set = (k: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setCampos((actual) => ({
      ...actual,
      [k]: value,
      ...(k === 'fecha' || k === 'espacioId' ? { slotId: '' } : {}),
    }))
    setErrores((actual) => ({ ...actual, [k]: undefined }))
  }

  const cerrar = () => {
    if (guardando) return
    onHide()
    setCampos(camposIniciales())
    setSlots([])
    setErrores({})
    setErrorApi(null)
  }

  const guardar = async () => {
    const err: Partial<Campos> = {}
    if (!campos.fecha) err.fecha = 'Selecciona la fecha de la reserva.'
    if (!campos.espacioId) err.espacioId = 'Selecciona la zona a reservar.'
    if (!campos.slotId) err.slotId = 'Selecciona una franja disponible.'
    setErrores(err)
    if (Object.keys(err).length > 0) return

    const sesion = getSesion()
    if (!sesion) {
      setErrorApi('La sesión expiró. Inicia sesión nuevamente para crear la reserva.')
      return
    }

    setGuardando(true)
    setErrorApi(null)
    try {
      const reserva = await agendamiento.crearReserva({
        usuarioId: sesion.id,
        slotId: campos.slotId,
        tipo: 'CUPO_GIMNASIO',
      })
      showToast({
        title: 'Reserva confirmada',
        body: 'La reserva se guardó en el servidor y el cupo quedó actualizado.',
      })
      onSaved(reserva)
      onHide()
      setCampos(camposIniciales())
      setSlots([])
      setErrores({})
    } catch (error) {
      setErrorApi(error instanceof ApiError ? error.userMessage : 'No se pudo guardar la reserva.')
    } finally {
      setGuardando(false)
    }
  }

  const disponibles = slots.filter(
    (slot) => slot.estado === 'DISPONIBLE' && slot.cuposDisponibles > 0,
  )

  return (
    <Modal show={show} onHide={cerrar} centered aria-labelledby="titulo-crear-reserva">
      <Modal.Header closeButton={!guardando} closeLabel="Cerrar sin guardar">
        <Modal.Title id="titulo-crear-reserva" className="fs-5">
          Crear reserva
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-grid gap-3">
        <Form.Group controlId="reserva-fecha">
          <Form.Label className="sg-field-label">Fecha</Form.Label>
          <Form.Control
            type="date"
            min={hoy()}
            value={campos.fecha}
            onChange={set('fecha')}
            isInvalid={!!errores.fecha}
            autoFocus
          />
          <Form.Control.Feedback type="invalid">{errores.fecha}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="reserva-zona">
          <Form.Label className="sg-field-label">Zona</Form.Label>
          <Form.Select
            value={campos.espacioId}
            onChange={set('espacioId')}
            isInvalid={!!errores.espacioId}
          >
            <option value="">Selecciona la zona</option>
            {espacios.map((espacio) => (
              <option key={espacio.id} value={espacio.id}>
                {espacio.nombre} · {espacio.capacidadMaxima} personas
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.espacioId}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="reserva-franja">
          <Form.Label className="sg-field-label">Franja horaria</Form.Label>
          <Form.Select
            value={campos.slotId}
            onChange={set('slotId')}
            isInvalid={!!errores.slotId}
            disabled={!campos.espacioId || cargandoSlots}
          >
            <option value="">
              {cargandoSlots ? 'Consultando disponibilidad…' : 'Selecciona una franja'}
            </option>
            {disponibles.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.horaInicio} a {slot.horaFin} · {slot.cuposDisponibles} cupos
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.slotId}</Form.Control.Feedback>
          {!cargandoSlots && campos.espacioId && disponibles.length === 0 ? (
            <Form.Text className="sg-field-hint">No hay franjas disponibles para esta fecha.</Form.Text>
          ) : null}
        </Form.Group>
        {errorApi ? <p className="m-0 sg-form-note text-danger" role="alert">{errorApi}</p> : null}
        <p className="m-0 sg-form-note">
          La reserva se registra en el backend y actualiza el cupo disponible de la franja.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <AppButton variant="ghost" onClick={cerrar} disabled={guardando}>
          Cancelar reserva
        </AppButton>
        <AppButton icon="check" onClick={guardar} disabled={guardando || cargandoSlots}>
          {guardando ? 'Guardando…' : 'Confirmar reserva'}
        </AppButton>
      </Modal.Footer>
    </Modal>
  )
}
