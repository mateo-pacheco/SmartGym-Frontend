import type { ReactNode } from 'react'
import Modal from 'react-bootstrap/Modal'
import { AppButton } from '../actions/AppButton'

export interface ConfirmDialogProps {
  show: boolean
  title: string
  body: ReactNode
  /** Texto del botón que confirma la acción (p. ej. «Bloquear»). */
  confirmLabel: string
  cancelLabel?: string
  /** Da estilo de acción destructiva al botón de confirmación. */
  danger?: boolean
  /** Deshabilita los botones mientras la acción se ejecuta. */
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/* Confirmación explícita antes de una acción irreversible o sensible
   (eliminar, cancelar, bloquear). No ejecuta nada por sí mismo. */
export function ConfirmDialog({
  show,
  title,
  body,
  confirmLabel,
  cancelLabel = 'Cancelar',
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal show={show} onHide={busy ? () => undefined : onCancel} centered aria-labelledby="titulo-confirmacion">
      <Modal.Header closeButton={!busy} closeLabel="Cerrar">
        <Modal.Title id="titulo-confirmacion" className="fs-5">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="sg-form-note m-0">{body}</div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <AppButton variant="ghost" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </AppButton>
        <AppButton
          variant={danger ? 'danger' : 'primary'}
          icon={danger ? 'basura' : 'check'}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? 'Procesando…' : confirmLabel}
        </AppButton>
      </Modal.Footer>
    </Modal>
  )
}
