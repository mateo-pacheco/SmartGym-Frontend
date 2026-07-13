import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AppButton } from '../../components/actions/AppButton'
import { useToast } from '../../app/providers/useToast'
import { clinicalEvaluations } from '../../services/api/endpoints'
import { getSesion } from '../../services/api/auth'
import { ApiError } from '../../services/api/http'

interface Campos {
  deportistaId: string
  diagnostico: string
  observaciones: string
  rpe: string
}

const INICIALES: Campos = { deportistaId: '', diagnostico: '', observaciones: '', rpe: '' }
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function NuevoDeportistaModal({
  show,
  onHide,
  onSaved,
}: {
  show: boolean
  onHide: () => void
  onSaved: () => void
}) {
  const [campos, setCampos] = useState<Campos>(INICIALES)
  const [errores, setErrores] = useState<Partial<Campos>>({})
  const [guardando, setGuardando] = useState(false)
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const { showToast } = useToast()

  const set = (k: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCampos((c) => ({ ...c, [k]: e.target.value }))
    setErrores((err) => ({ ...err, [k]: undefined }))
  }

  const cerrar = () => {
    if (guardando) return
    onHide()
    setCampos(INICIALES)
    setErrores({})
    setErrorApi(null)
  }

  const guardar = async () => {
    const err: Partial<Campos> = {}
    if (!UUID_RE.test(campos.deportistaId.trim())) err.deportistaId = 'Escribe un UUID válido.'
    if (!campos.diagnostico.trim()) err.diagnostico = 'Registra el diagnóstico o valoración.'
    const rpe = campos.rpe === '' ? undefined : Number(campos.rpe)
    if (rpe !== undefined && (!Number.isInteger(rpe) || rpe < 0 || rpe > 10)) err.rpe = 'El RPE debe estar entre 0 y 10.'
    setErrores(err)
    if (Object.keys(err).length) return
    const sesion = getSesion()
    if (!sesion) {
      setErrorApi('La sesión expiró. Inicia sesión nuevamente.')
      return
    }
    setGuardando(true)
    setErrorApi(null)
    try {
      await clinicalEvaluations.crear({
        deportistaId: campos.deportistaId.trim(),
        profesionalId: sesion.id,
        diagnostico: campos.diagnostico.trim(),
        observaciones: campos.observaciones.trim() || undefined,
        rpe,
      })
      showToast({ title: 'Evaluación registrada', body: 'El expediente clínico se actualizó en el servidor.' })
      onSaved()
      onHide()
      setCampos(INICIALES)
    } catch (error) {
      setErrorApi(error instanceof ApiError ? error.message : 'No se pudo registrar la evaluación.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal show={show} onHide={cerrar} centered aria-labelledby="titulo-nueva-evaluacion">
      <Modal.Header closeButton={!guardando} closeLabel="Cerrar sin guardar">
        <Modal.Title id="titulo-nueva-evaluacion" className="fs-5">Nueva evaluación clínica</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-grid gap-3">
        <Form.Group controlId="evaluacion-deportista">
          <Form.Label className="sg-field-label">ID del deportista</Form.Label>
          <Form.Control value={campos.deportistaId} onChange={set('deportistaId')} isInvalid={!!errores.deportistaId} placeholder="UUID del deportista" autoFocus />
          <Form.Control.Feedback type="invalid">{errores.deportistaId}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="evaluacion-diagnostico">
          <Form.Label className="sg-field-label">Diagnóstico o valoración</Form.Label>
          <Form.Control value={campos.diagnostico} onChange={set('diagnostico')} isInvalid={!!errores.diagnostico} />
          <Form.Control.Feedback type="invalid">{errores.diagnostico}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="evaluacion-rpe">
          <Form.Label className="sg-field-label">RPE (0–10)</Form.Label>
          <Form.Control type="number" min={0} max={10} value={campos.rpe} onChange={set('rpe')} isInvalid={!!errores.rpe} />
          <Form.Control.Feedback type="invalid">{errores.rpe}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="evaluacion-observaciones">
          <Form.Label className="sg-field-label">Observaciones</Form.Label>
          <Form.Control as="textarea" rows={3} value={campos.observaciones} onChange={set('observaciones')} />
        </Form.Group>
        {errorApi ? <p className="m-0 sg-form-note text-danger" role="alert">{errorApi}</p> : null}
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <AppButton variant="ghost" onClick={cerrar} disabled={guardando}>Cancelar</AppButton>
        <AppButton icon="check" onClick={guardar} disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar evaluación'}</AppButton>
      </Modal.Footer>
    </Modal>
  )
}
