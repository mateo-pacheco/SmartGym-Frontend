import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AppButton } from '../../components/actions/AppButton'
import { Stepper } from '../../components/forms/Stepper'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { useDrafts } from '../../services/drafts/useDrafts'
import { useToast } from '../../app/providers/useToast'

/* Alta de manilla como asistente guiado (AGENTS.md §15). El resultado se
   guarda como borrador local etiquetado: no existe contrato API que permita
   sincronizar, y eso se declara en el paso de confirmación. */

const PASOS = ['Deportista', 'Manilla', 'Confirmación']

interface Campos {
  deportista: string
  programa: string
  identificador: string
}

const CAMPOS_INICIALES: Campos = { deportista: '', programa: '', identificador: '' }

export function RegistrarManillaModal({ show, onHide }: { show: boolean; onHide: () => void }) {
  const [paso, setPaso] = useState(0)
  const [campos, setCampos] = useState<Campos>(CAMPOS_INICIALES)
  const [errores, setErrores] = useState<Partial<Campos>>({})
  const { addManilla } = useDrafts()
  const { showToast } = useToast()

  const set = (k: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCampos((c) => ({ ...c, [k]: e.target.value }))
    setErrores((err) => ({ ...err, [k]: undefined }))
  }

  const validarPaso = (): boolean => {
    const err: Partial<Campos> = {}
    if (paso === 0) {
      if (!campos.deportista.trim()) err.deportista = 'Escribe el nombre del deportista.'
      if (!campos.programa) err.programa = 'Selecciona el programa deportivo.'
    }
    if (paso === 1) {
      if (!campos.identificador.trim()) {
        err.identificador = 'Asigna un identificador público, por ejemplo MAN-0042.'
      } else if (!/^[A-Z]{2,5}-\d{2,6}$/i.test(campos.identificador.trim())) {
        err.identificador = 'Usa el formato letras-números, por ejemplo MAN-0042.'
      }
    }
    setErrores(err)
    return Object.keys(err).length === 0
  }

  const cerrar = () => {
    onHide()
    setPaso(0)
    setCampos(CAMPOS_INICIALES)
    setErrores({})
  }

  const guardar = () => {
    addManilla({
      deportista: campos.deportista.trim(),
      programa: campos.programa,
      identificador: campos.identificador.trim().toUpperCase(),
    })
    showToast({
      title: 'Manilla guardada como borrador local',
      body: 'Se sincronizará cuando el contrato de accesos esté confirmado.',
    })
    cerrar()
  }

  return (
    <Modal show={show} onHide={cerrar} centered aria-labelledby="titulo-registrar-manilla">
      <Modal.Header closeButton closeLabel="Cerrar sin guardar">
        <Modal.Title id="titulo-registrar-manilla" className="fs-5">
          Registrar manilla
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-grid gap-3">
        <Stepper steps={PASOS} current={paso} />

        {paso === 0 && (
          <>
            <Form.Group controlId="manilla-deportista">
              <Form.Label className="sg-field-label">Nombre del deportista</Form.Label>
              <Form.Control
                value={campos.deportista}
                onChange={set('deportista')}
                isInvalid={!!errores.deportista}
                placeholder="Nombre y apellido"
                autoFocus
              />
              <Form.Control.Feedback type="invalid">{errores.deportista}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="manilla-programa">
              <Form.Label className="sg-field-label">Programa deportivo</Form.Label>
              <Form.Select
                value={campos.programa}
                onChange={set('programa')}
                isInvalid={!!errores.programa}
              >
                <option value="">Selecciona un programa</option>
                <option value="Alto rendimiento">Alto rendimiento</option>
                <option value="Formativo">Formativo</option>
                <option value="Recreativo">Recreativo</option>
                <option value="Rehabilitación">Rehabilitación</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.programa}</Form.Control.Feedback>
            </Form.Group>
          </>
        )}

        {paso === 1 && (
          <Form.Group controlId="manilla-identificador">
            <Form.Label className="sg-field-label">Identificador público de la manilla</Form.Label>
            <Form.Control
              value={campos.identificador}
              onChange={set('identificador')}
              isInvalid={!!errores.identificador}
              placeholder="MAN-0042"
              autoFocus
            />
            <Form.Control.Feedback type="invalid">{errores.identificador}</Form.Control.Feedback>
            <Form.Text className="sg-field-hint">
              Solo se registra el identificador visible. Los valores NFC y HMAC los gestiona el
              backend y nunca se muestran en pantalla.
            </Form.Text>
          </Form.Group>
        )}

        {paso === 2 && (
          <>
            <dl className="sg-deflist sg-surface--inset p-3 m-0">
              <div>
                <dt>Deportista</dt>
                <dd>{campos.deportista}</dd>
              </div>
              <div>
                <dt>Programa</dt>
                <dd>{campos.programa}</dd>
              </div>
              <div>
                <dt>Identificador</dt>
                <dd>{campos.identificador.toUpperCase()}</dd>
              </div>
              <div>
                <dt>Estado al guardar</dt>
                <dd>
                  <StatusBadge tone="neutral" label="Borrador local" icon="reloj" />
                </dd>
              </div>
            </dl>
            <p className="m-0 sg-form-note">
              El contrato de accesos NFC aún no está confirmado: este registro quedará como
              borrador local de esta sesión y no se enviará a ningún servidor.
            </p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <AppButton variant="ghost" onClick={paso === 0 ? cerrar : () => setPaso((p) => p - 1)}>
          {paso === 0 ? 'Cancelar registro' : 'Volver al paso anterior'}
        </AppButton>
        {paso < 2 ? (
          <AppButton iconEnd="flechaDerecha" onClick={() => validarPaso() && setPaso((p) => p + 1)}>
            Continuar
          </AppButton>
        ) : (
          <AppButton icon="check" onClick={guardar}>
            Guardar borrador local
          </AppButton>
        )}
      </Modal.Footer>
    </Modal>
  )
}
