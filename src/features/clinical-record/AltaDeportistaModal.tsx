import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AppButton } from '../../components/actions/AppButton'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { useToast } from '../../app/providers/useToast'
import { registrarDeportista } from '../../services/api/auth'

/* Alta de deportista = alta de usuario en Supabase. Al crearse, muestra el
   UUID resultante (copiable) para usarlo en evaluaciones y manillas. La
   contraseña se envía a Supabase por HTTPS y no se guarda en el cliente. */
export function AltaDeportistaModal({ show, onHide }: { show: boolean; onHide: () => void }) {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [errores, setErrores] = useState<{ correo?: string; clave?: string }>({})
  const [enviando, setEnviando] = useState(false)
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const [creado, setCreado] = useState<{ id: string; correo: string; requiereConfirmacion: boolean } | null>(null)
  const { showToast } = useToast()

  const reiniciar = () => {
    setCorreo('')
    setClave('')
    setErrores({})
    setErrorApi(null)
    setCreado(null)
  }

  const cerrar = () => {
    if (enviando) return
    onHide()
    reiniciar()
  }

  const copiar = async () => {
    if (!creado) return
    try {
      await navigator.clipboard.writeText(creado.id)
      showToast({ title: 'UUID copiado', body: 'Pégalo en el formulario de evaluación o manilla.' })
    } catch {
      /* clipboard bloqueado: el UUID queda visible para copiar a mano */
    }
  }

  const crear = async () => {
    const err: typeof errores = {}
    if (!/^\S+@\S+\.\S+$/.test(correo.trim())) err.correo = 'Escribe un correo válido.'
    if (clave.length < 6) err.clave = 'La contraseña debe tener al menos 6 caracteres.'
    setErrores(err)
    if (Object.keys(err).length) return

    setEnviando(true)
    setErrorApi(null)
    const resultado = await registrarDeportista(correo, clave)
    setEnviando(false)

    if (!resultado.ok) {
      setErrorApi(resultado.motivo)
      return
    }
    setCreado(resultado)
    setClave('')
    showToast({ title: 'Deportista creado', body: 'Se registró el usuario en el sistema de identidad.' })
  }

  return (
    <Modal show={show} onHide={cerrar} centered aria-labelledby="titulo-alta-deportista">
      <Modal.Header closeButton={!enviando} closeLabel="Cerrar">
        <Modal.Title id="titulo-alta-deportista" className="fs-5">
          Nuevo deportista
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-grid gap-3">
        {creado ? (
          <>
            <div className="d-flex align-items-center gap-2">
              <StatusBadge tone="success" label="Deportista creado" icon="check" />
            </div>
            <div>
              <span className="sg-field-label d-block">UUID del deportista</span>
              <code className="d-block sg-surface--inset p-2 rounded text-break">{creado.id}</code>
            </div>
            <AppButton icon="copiar" onClick={copiar}>
              Copiar UUID
            </AppButton>
            <p className="m-0 sg-form-note text-warning">
              Esto crea la cuenta de acceso (login). Para usar el UUID en evaluaciones o manillas, el
              backend debe reconocer al deportista: hoy solo funcionan los deportistas ya existentes.
              {creado.requiereConfirmacion ? ' El correo además debe confirmarse antes de iniciar sesión.' : ''}
            </p>
          </>
        ) : (
          <>
            <Form.Group controlId="alta-correo">
              <Form.Label className="sg-field-label">Correo institucional</Form.Label>
              <Form.Control
                type="email"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value)
                  setErrores((x) => ({ ...x, correo: undefined }))
                }}
                isInvalid={!!errores.correo}
                placeholder="nombre.apellido@ucacue.edu.ec"
                autoFocus
              />
              <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="alta-clave">
              <Form.Label className="sg-field-label">Contraseña inicial</Form.Label>
              <Form.Control
                type="password"
                value={clave}
                onChange={(e) => {
                  setClave(e.target.value)
                  setErrores((x) => ({ ...x, clave: undefined }))
                }}
                isInvalid={!!errores.clave}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">{errores.clave}</Form.Control.Feedback>
              <Form.Text className="sg-field-hint">
                El deportista podrá cambiarla luego. Se envía cifrada por HTTPS; no se guarda aquí.
              </Form.Text>
            </Form.Group>
            {errorApi ? <p className="m-0 sg-form-note text-danger" role="alert">{errorApi}</p> : null}
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <AppButton variant="ghost" onClick={cerrar} disabled={enviando}>
          {creado ? 'Cerrar' : 'Cancelar'}
        </AppButton>
        {creado ? (
          <AppButton icon="mas" onClick={reiniciar}>
            Crear otro
          </AppButton>
        ) : (
          <AppButton icon="check" onClick={crear} disabled={enviando}>
            {enviando ? 'Creando…' : 'Crear deportista'}
          </AppButton>
        )}
      </Modal.Footer>
    </Modal>
  )
}
