import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AppButton } from '../../components/actions/AppButton'
import { Stepper } from '../../components/forms/Stepper'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { useToast } from '../../app/providers/useToast'
import { manillasNfc } from '../../services/api/endpoints'
import { ApiError } from '../../services/api/http'
import type { ManillaNfcResponseDTO } from '../../services/api/types'

const PASOS = ['Deportista', 'Manilla', 'Confirmación']
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

interface Campos {
  deportistaId: string
  codigoNfc: string
}

const CAMPOS_INICIALES: Campos = { deportistaId: '', codigoNfc: '' }

interface RegistrarManillaModalProps {
  show: boolean
  onHide: () => void
  deportistaIds: string[]
  onSaved: (manilla: ManillaNfcResponseDTO) => void
}

export function RegistrarManillaModal({
  show,
  onHide,
  deportistaIds,
  onSaved,
}: RegistrarManillaModalProps) {
  const [paso, setPaso] = useState(0)
  const [campos, setCampos] = useState<Campos>(CAMPOS_INICIALES)
  const [errores, setErrores] = useState<Partial<Campos>>({})
  const [guardando, setGuardando] = useState(false)
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const { showToast } = useToast()

  const set = (k: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampos((actual) => ({ ...actual, [k]: e.target.value }))
    setErrores((actual) => ({ ...actual, [k]: undefined }))
    setErrorApi(null)
  }

  const validarPaso = (): boolean => {
    const err: Partial<Campos> = {}
    if (paso === 0 && !UUID_RE.test(campos.deportistaId.trim())) {
      err.deportistaId = 'Selecciona o escribe un ID de deportista válido.'
    }
    if (paso === 1) {
      const codigo = campos.codigoNfc.trim()
      if (!codigo) err.codigoNfc = 'Lee o escribe el código NFC de la manilla.'
      else if (codigo.length < 6) err.codigoNfc = 'El código NFC debe tener al menos 6 caracteres.'
    }
    setErrores(err)
    return Object.keys(err).length === 0
  }

  const reiniciar = () => {
    setPaso(0)
    setCampos(CAMPOS_INICIALES)
    setErrores({})
    setErrorApi(null)
  }

  const cerrar = () => {
    if (guardando) return
    onHide()
    reiniciar()
  }

  const guardar = async () => {
    setGuardando(true)
    setErrorApi(null)
    try {
      const manilla = await manillasNfc.registrar({
        deportistaId: campos.deportistaId.trim(),
        codigoNfc: campos.codigoNfc.trim(),
      })
      onSaved(manilla)
      showToast({
        title: 'Manilla registrada',
        body: `La manilla ${manilla.codigoNfcMascara} quedó activa en el servidor.`,
      })
      onHide()
      reiniciar()
    } catch (error) {
      setErrorApi(error instanceof ApiError ? error.message : 'No se pudo registrar la manilla.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal show={show} onHide={cerrar} centered aria-labelledby="titulo-registrar-manilla">
      <Modal.Header closeButton={!guardando} closeLabel="Cerrar sin guardar">
        <Modal.Title id="titulo-registrar-manilla" className="fs-5">
          Registrar manilla
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-grid gap-3">
        <Stepper steps={PASOS} current={paso} />

        {paso === 0 ? (
          <Form.Group controlId="manilla-deportista">
            <Form.Label className="sg-field-label">ID del deportista</Form.Label>
            <Form.Control
              value={campos.deportistaId}
              onChange={set('deportistaId')}
              isInvalid={!!errores.deportistaId}
              placeholder="UUID del deportista"
              list="deportistas-con-accesos"
              autoComplete="off"
              autoFocus
            />
            <datalist id="deportistas-con-accesos">
              {deportistaIds.map((id) => <option key={id} value={id} />)}
            </datalist>
            <Form.Control.Feedback type="invalid">{errores.deportistaId}</Form.Control.Feedback>
            <Form.Text className="sg-field-hint">
              Puedes seleccionar uno de los deportistas sincronizados o pegar su UUID.
            </Form.Text>
          </Form.Group>
        ) : null}

        {paso === 1 ? (
          <Form.Group controlId="manilla-codigo-nfc">
            <Form.Label className="sg-field-label">Código NFC</Form.Label>
            <Form.Control
              type="password"
              value={campos.codigoNfc}
              onChange={set('codigoNfc')}
              isInvalid={!!errores.codigoNfc}
              placeholder="Lee la manilla con el lector NFC"
              autoComplete="new-password"
              autoFocus
            />
            <Form.Control.Feedback type="invalid">{errores.codigoNfc}</Form.Control.Feedback>
            <Form.Text className="sg-field-hint">
              El código se envía una sola vez por HTTPS; el backend almacena su HMAC y devuelve solo una máscara.
            </Form.Text>
          </Form.Group>
        ) : null}

        {paso === 2 ? (
          <>
            <dl className="sg-deflist sg-surface--inset p-3 m-0">
              <div><dt>Deportista</dt><dd>{campos.deportistaId}</dd></div>
              <div><dt>Código NFC</dt><dd>••••{campos.codigoNfc.slice(-4)}</dd></div>
              <div>
                <dt>Estado al guardar</dt>
                <dd><StatusBadge tone="success" label="Activa" icon="check" /></dd>
              </div>
            </dl>
            <p className="m-0 sg-form-note">
              El registro se guardará directamente en el backend y quedará disponible para validar accesos.
            </p>
          </>
        ) : null}

        {errorApi ? <p className="m-0 sg-form-note text-danger" role="alert">{errorApi}</p> : null}
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <AppButton variant="ghost" onClick={paso === 0 ? cerrar : () => setPaso((p) => p - 1)} disabled={guardando}>
          {paso === 0 ? 'Cancelar registro' : 'Volver al paso anterior'}
        </AppButton>
        {paso < 2 ? (
          <AppButton iconEnd="flechaDerecha" onClick={() => validarPaso() && setPaso((p) => p + 1)}>
            Continuar
          </AppButton>
        ) : (
          <AppButton icon="check" onClick={guardar} disabled={guardando}>
            {guardando ? 'Registrando…' : 'Registrar manilla'}
          </AppButton>
        )}
      </Modal.Footer>
    </Modal>
  )
}
