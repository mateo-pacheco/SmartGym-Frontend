import { createContext } from 'react'

export interface ToastMessage {
  id: number
  title: string
  body?: string
}

export interface ToastContextValue {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
