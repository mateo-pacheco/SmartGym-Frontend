import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AppButton } from '../../components/actions/AppButton'
import { useDrafts } from '../../services/drafts/useDrafts'
import { useToast } from '../../app/providers/useToast'

interface Campos {
  fecha: string
  franja: string
  zona: string
  deportista: string
}

const CAMPOS_INICIALES: Campos = { fecha: '', franja: '', zona: '', deportista: '' }

export function CrearReservaModal({ show, onHide }: { show: boolean; onHide: () => void }) {
  const [campos, setCampos] = useState<Campos>(CAMPOS_INICIALES)
  const [errores, setErrores] = useState<Partial<Campos>>({})
  const { addReserva } = useDrafts()
  const { showToast } = useToast()

  const set = (k: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCampos((c) => ({ ...c, [k]: e.target.value }))
    setErrores((err) => ({ ...err, [k]: undefined }))
  }

  const cerrar = () => {
    onHide()
    setCampos(CAMPOS_INICIALES)
    setErrores({})
  }

  const guardar = () => {
    const err: Partial<Campos> = {}
    if (!campos.fecha) err.fecha = 'Selecciona la fecha de la reserva.'
    if (!campos.franja) err.franja = 'Selecciona una franja horaria.'
    if (!campos.zona) err.zona = 'Selecciona la zona a reservar.'
    if (!campos.deportista.trim()) err.deportista = 'Escribe quién reserva.'
    setErrores(err)
    if (Object.keys(err).length > 0) return

    addReserva({ ...campos, deportista: campos.deportista.trim() })
    showToast({
      title: 'Reserva guardada como borrador local',
      body: 'Se sincronizará cuando el contrato de agenda esté confirmado.',
    })
    cerrar()
  }

  return (
    <Modal show={show} onHide={cerrar} centered aria-labelledby="titulo-crear-reserva">
      <Modal.Header closeButton closeLabel="Cerrar sin guardar">
        <Modal.Title id="titulo-crear-reserva" className="fs-5">
          Crear reserva
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-grid gap-3">
        <div className="row g-3">
          <Form.Group className="col-6" controlId="reserva-fecha">
            <Form.Label className="sg-field-label">Fecha</Form.Label>
            <Form.Control
              type="date"
              value={campos.fecha}
              onChange={set('fecha')}
              isInvalid={!!errores.fecha}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">{errores.fecha}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col-6" controlId="reserva-franja">
            <Form.Label className="sg-field-label">Franja horaria</Form.Label>
            <Form.Select value={campos.franja} onChange={set('franja')} isInvalid={!!errores.franja}>
              <option value="">Selecciona</option>
              <option>06:00 a 08:00</option>
              <option>08:00 a 10:00</option>
              <option>10:00 a 12:00</option>
              <option>14:00 a 16:00</option>
              <option>16:00 a 18:00</option>
              <option>18:00 a 20:00</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.franja}</Form.Control.Feedback>
          </Form.Group>
        </div>
        <Form.Group controlId="reserva-zona">
          <Form.Label className="sg-field-label">Zona</Form.Label>
          <Form.Select value={campos.zona} onChange={set('zona')} isInvalid={!!errores.zona}>
            <option value="">Selecciona la zona</option>
            <option>Sala de fuerza</option>
            <option>Zona cardio</option>
            <option>Estudio XR</option>
            <option>Pista exterior</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.zona}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="reserva-deportista">
          <Form.Label className="sg-field-label">Deportista o grupo</Form.Label>
          <Form.Control
            value={campos.deportista}
            onChange={set('deportista')}
            isInvalid={!!errores.deportista}
            placeholder="Nombre del deportista o del grupo"
          />
          <Form.Control.Feedback type="invalid">{errores.deportista}</Form.Control.Feedback>
        </Form.Group>
        <p className="m-0 sg-form-note">
          Sin contrato de agenda confirmado, la reserva queda como borrador local: no bloquea aforo
          real ni se envía a ningún servidor.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <AppButton variant="ghost" onClick={cerrar}>
          Cancelar reserva
        </AppButton>
        <AppButton icon="check" onClick={guardar}>
          Guardar borrador local
        </AppButton>
      </Modal.Footer>
    </Modal>
  )
}
