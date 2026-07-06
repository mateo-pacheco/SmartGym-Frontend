import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AppButton } from '../../components/actions/AppButton'
import { useDrafts } from '../../services/drafts/useDrafts'
import { useToast } from '../../app/providers/useToast'

interface Campos {
  nombre: string
  programa: string
}

const CAMPOS_INICIALES: Campos = { nombre: '', programa: '' }

export function NuevoDeportistaModal({ show, onHide }: { show: boolean; onHide: () => void }) {
  const [campos, setCampos] = useState<Campos>(CAMPOS_INICIALES)
  const [errores, setErrores] = useState<Partial<Campos>>({})
  const { addDeportista } = useDrafts()
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
    if (!campos.nombre.trim()) err.nombre = 'Escribe el nombre del deportista.'
    if (!campos.programa) err.programa = 'Selecciona el programa deportivo.'
    setErrores(err)
    if (Object.keys(err).length > 0) return

    addDeportista({ nombre: campos.nombre.trim(), programa: campos.programa })
    showToast({
      title: 'Deportista guardado como borrador local',
      body: 'El expediente clínico se creará cuando exista contrato confirmado.',
    })
    cerrar()
  }

  return (
    <Modal show={show} onHide={cerrar} centered aria-labelledby="titulo-nuevo-deportista">
      <Modal.Header closeButton closeLabel="Cerrar sin guardar">
        <Modal.Title id="titulo-nuevo-deportista" className="fs-5">
          Nuevo deportista
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-grid gap-3">
        <Form.Group controlId="deportista-nombre">
          <Form.Label className="sg-field-label">Nombre completo</Form.Label>
          <Form.Control
            value={campos.nombre}
            onChange={set('nombre')}
            isInvalid={!!errores.nombre}
            placeholder="Nombre y apellido"
            autoFocus
          />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="deportista-programa">
          <Form.Label className="sg-field-label">Programa deportivo</Form.Label>
          <Form.Select value={campos.programa} onChange={set('programa')} isInvalid={!!errores.programa}>
            <option value="">Selecciona un programa</option>
            <option value="Alto rendimiento">Alto rendimiento</option>
            <option value="Formativo">Formativo</option>
            <option value="Recreativo">Recreativo</option>
            <option value="Rehabilitación">Rehabilitación</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.programa}</Form.Control.Feedback>
        </Form.Group>
        <p className="m-0 sg-form-note">
          No se piden datos clínicos aquí: el expediente de salud se gestiona con consentimiento y
          contrato confirmado. Este registro queda como borrador local.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <AppButton variant="ghost" onClick={cerrar}>
          Cancelar alta
        </AppButton>
        <AppButton icon="check" onClick={guardar}>
          Guardar borrador local
        </AppButton>
      </Modal.Footer>
    </Modal>
  )
}
