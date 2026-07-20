import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AppButton } from '../actions/AppButton'

export type CampoTipo = 'text' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select'

export interface CampoDef {
  key: string
  label: string
  tipo: CampoTipo
  requerido?: boolean
  placeholder?: string
  min?: number
  max?: number
  step?: number
  /** Solo para tipo 'select'. */
  opciones?: Array<{ value: string; label: string }>
  /** Texto de ayuda bajo el campo. */
  ayuda?: string
  /** Ancho: 'full' (por defecto) o 'half' para dos columnas. */
  ancho?: 'full' | 'half'
  /** Validación de formato del valor (además de presencia). */
  patron?: RegExp
  /** Mensaje cuando `patron` no coincide. */
  mensajeInvalido?: string
  /** Valor inicial al CREAR (cuando no hay registro en edición). */
  valorPorDefecto?: string
}

export type ValoresForm = Record<string, string>

export interface FormModalProps {
  show: boolean
  title: string
  campos: CampoDef[]
  valorInicial?: ValoresForm
  submitLabel: string
  enviando?: boolean
  /** Error del backend ya mapeado a mensaje seguro. */
  error?: string | null
  onSubmit: (valores: ValoresForm) => void
  onHide: () => void
}

function inicial(campos: CampoDef[], valorInicial?: ValoresForm): ValoresForm {
  const base: ValoresForm = {}
  for (const campo of campos) {
    // Al editar manda valorInicial; al crear, el valor por defecto del campo.
    base[campo.key] = valorInicial?.[campo.key] ?? campo.valorPorDefecto ?? ''
  }
  return base
}

/* Formulario genérico de creación/edición contra la API. La validación de
   presencia es local; el backend valida el resto y sus errores se muestran
   tal cual (400/409/422). No guarda borradores: envía directo al servidor. */
export function FormModal({
  show,
  title,
  campos,
  valorInicial,
  submitLabel,
  enviando = false,
  error,
  onSubmit,
  onHide,
}: FormModalProps) {
  const [valores, setValores] = useState<ValoresForm>(() => inicial(campos, valorInicial))
  const [errores, setErrores] = useState<Record<string, string>>({})

  // Rehidrata al abrir o al cambiar el registro editado.
  useEffect(() => {
    if (show) {
      setValores(inicial(campos, valorInicial))
      setErrores({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, valorInicial])

  const set = (key: string, value: string) => {
    setValores((v) => ({ ...v, [key]: value }))
    setErrores((e) => ({ ...e, [key]: '' }))
  }

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    const faltantes: Record<string, string> = {}
    for (const campo of campos) {
      const valor = valores[campo.key]?.trim() ?? ''
      if (campo.requerido && !valor) {
        faltantes[campo.key] = 'Este campo es obligatorio.'
      } else if (valor && campo.patron && !campo.patron.test(valor)) {
        faltantes[campo.key] = campo.mensajeInvalido ?? 'Formato inválido.'
      }
    }
    setErrores(faltantes)
    if (Object.keys(faltantes).length > 0) return
    onSubmit(valores)
  }

  return (
    <Modal show={show} onHide={enviando ? () => undefined : onHide} centered size="lg" aria-labelledby="titulo-form">
      <Form onSubmit={enviar} noValidate>
        <Modal.Header closeButton={!enviando} closeLabel="Cerrar sin guardar">
          <Modal.Title id="titulo-form" className="fs-5">
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            {campos.map((campo) => (
              <div key={campo.key} className={campo.ancho === 'half' ? 'col-sm-6' : 'col-12'}>
                <Form.Group controlId={`campo-${campo.key}`}>
                  <Form.Label className="sg-field-label">
                    {campo.label}
                    {campo.requerido ? <span aria-hidden="true"> *</span> : null}
                  </Form.Label>
                  {campo.tipo === 'select' ? (
                    <Form.Select
                      value={valores[campo.key] ?? ''}
                      onChange={(e) => set(campo.key, e.target.value)}
                      isInvalid={!!errores[campo.key]}
                    >
                      <option value="">{campo.placeholder ?? 'Selecciona…'}</option>
                      {(campo.opciones ?? []).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Form.Select>
                  ) : campo.tipo === 'textarea' ? (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={valores[campo.key] ?? ''}
                      placeholder={campo.placeholder}
                      onChange={(e) => set(campo.key, e.target.value)}
                      isInvalid={!!errores[campo.key]}
                    />
                  ) : (
                    <Form.Control
                      type={campo.tipo}
                      value={valores[campo.key] ?? ''}
                      placeholder={campo.placeholder}
                      min={campo.min}
                      max={campo.max}
                      step={campo.step}
                      onChange={(e) => set(campo.key, e.target.value)}
                      isInvalid={!!errores[campo.key]}
                    />
                  )}
                  <Form.Control.Feedback type="invalid">{errores[campo.key]}</Form.Control.Feedback>
                  {campo.ayuda ? <Form.Text className="sg-field-hint">{campo.ayuda}</Form.Text> : null}
                </Form.Group>
              </div>
            ))}
          </div>
          {error ? (
            <p className="m-0 mt-3 sg-form-note text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <AppButton variant="ghost" onClick={onHide} disabled={enviando}>
            Cancelar
          </AppButton>
          <AppButton icon="check" type="submit" disabled={enviando}>
            {enviando ? 'Guardando…' : submitLabel}
          </AppButton>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
