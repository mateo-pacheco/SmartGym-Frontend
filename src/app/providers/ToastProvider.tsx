import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { Icon } from '../../components/icons/Icon'
import { ToastContext, type ToastMessage } from './toast-context'

/* Región de toasts única de la aplicación: entrada lateral ligera,
   salida en fade, sin rebote (AGENTS.md §12). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextId = useRef(1)

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = nextId.current++
    setToasts((prev) => [...prev.slice(-2), { ...toast, id }])
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer position="bottom-end" className="p-3 sg-toast-region" aria-live="polite">
        {toasts.map((toast) => (
          <Toast key={toast.id} onClose={() => dismiss(toast.id)} delay={4200} autohide>
            <Toast.Header closeLabel="Cerrar aviso">
              <span className="me-2" style={{ color: 'var(--sg-success-700)' }}>
                <Icon name="check" size={15} />
              </span>
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            {toast.body ? <Toast.Body>{toast.body}</Toast.Body> : null}
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}
