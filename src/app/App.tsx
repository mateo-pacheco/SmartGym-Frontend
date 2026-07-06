import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './providers/ThemeProvider'
import { ToastProvider } from './providers/ToastProvider'
import { DraftsProvider } from '../services/drafts/DraftsProvider'
import { router } from './router'

export default function App() {
  return (
    <ThemeProvider>
      <DraftsProvider>
        <ToastProvider>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </ToastProvider>
      </DraftsProvider>
    </ThemeProvider>
  )
}
