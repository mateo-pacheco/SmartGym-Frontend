import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../services/api/runtimeEnv', () => ({
  runtimeEnv: { apiUrl: 'https://backend.test', supabaseUrl: 'https://supabase.test', supabaseAnonKey: 'anon' },
}))

vi.mock('../services/api/endpoints', () => ({
  riskAlerts: {
    listar: vi.fn().mockResolvedValue([]),
    crear: vi.fn(),
    actualizar: vi.fn(),
    eliminar: vi.fn(),
  },
}))

import AlertasPage from '../features/medical-risk/AlertasPage'
import { ThemeProvider } from '../app/providers/ThemeProvider'
import { ToastProvider } from '../app/providers/ToastProvider'
import { setApiToken, clearApiToken } from '../services/api/http'
import { authStore } from '../services/api/authStore'

function jwt(rol: string) {
  const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${b64({ alg: 'none' })}.${b64({ sub: 'u', app_metadata: { roles: [rol] } })}.s`
}

function renderPagina() {
  return render(
    <ThemeProvider>
      <ToastProvider>
        <MemoryRouter>
          <AlertasPage />
        </MemoryRouter>
      </ToastProvider>
    </ThemeProvider>,
  )
}

beforeEach(() => {
  window.sessionStorage.clear()
  window.localStorage.clear()
})
afterEach(() => {
  clearApiToken()
  authStore.refrescar()
  vi.clearAllMocks()
})

describe('AlertasPage · roles', () => {
  it('ADMINISTRADOR ve la acción de crear alerta', async () => {
    setApiToken(jwt('ADMINISTRADOR'))
    authStore.refrescar()
    renderPagina()
    await waitFor(() => expect(screen.getByText('Sin alertas registradas')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /nuevo alerta/i })).toBeInTheDocument()
  })

  it('ESTUDIANTE no ve acciones administrativas', async () => {
    setApiToken(jwt('ESTUDIANTE'))
    authStore.refrescar()
    renderPagina()
    await waitFor(() => expect(screen.getByText('Sin alertas registradas')).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: /nuevo alerta/i })).not.toBeInTheDocument()
  })
})
