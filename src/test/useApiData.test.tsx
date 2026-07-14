import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

vi.mock('../services/api/runtimeEnv', () => ({
  runtimeEnv: { apiUrl: 'https://backend.test', supabaseUrl: 'https://supabase.test', supabaseAnonKey: 'anon' },
}))

import { useApiData } from '../services/api/useApiData'
import { ApiError, setApiToken, clearApiToken } from '../services/api/http'
import { authStore } from '../services/api/authStore'

function jwt() {
  const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${b64({ alg: 'none' })}.${b64({ sub: 'u', app_metadata: { roles: ['ADMINISTRADOR'] } })}.s`
}

function Sonda({ fetcher }: { fetcher: () => Promise<unknown> }) {
  const { estado, datos, error } = useApiData(fetcher)
  return (
    <div>
      <span data-testid="estado">{estado}</span>
      <span data-testid="error">{error ?? ''}</span>
      <span data-testid="n">{Array.isArray(datos) ? datos.length : ''}</span>
    </div>
  )
}

beforeEach(() => {
  window.sessionStorage.clear()
  window.localStorage.clear()
  setApiToken(jwt())
  authStore.refrescar()
})
afterEach(() => {
  clearApiToken()
  vi.restoreAllMocks()
})

describe('useApiData', () => {
  it('pasa a «listo» con los datos cuando la petición responde', async () => {
    render(<Sonda fetcher={() => Promise.resolve([1, 2, 3])} />)
    await waitFor(() => expect(screen.getByTestId('estado').textContent).toBe('listo'))
    expect(screen.getByTestId('n').textContent).toBe('3')
  })

  it('un 403 se muestra como «sin-permiso», no como error de conexión', async () => {
    render(<Sonda fetcher={() => Promise.reject(new ApiError(403))} />)
    await waitFor(() => expect(screen.getByTestId('estado').textContent).toBe('sin-permiso'))
    expect(screen.getByTestId('error').textContent).toBe('')
  })

  it('un error de backend expone «error» con mensaje seguro', async () => {
    render(<Sonda fetcher={() => Promise.reject(new ApiError(500))} />)
    await waitFor(() => expect(screen.getByTestId('estado').textContent).toBe('error'))
    expect(screen.getByTestId('error').textContent).toMatch(/no está disponible/i)
  })

  it('sin sesión válida no consulta y declara «sin-sesion»', async () => {
    clearApiToken()
    authStore.refrescar()
    const fetcher = vi.fn(() => Promise.resolve([]))
    render(<Sonda fetcher={fetcher} />)
    await waitFor(() => expect(screen.getByTestId('estado').textContent).toBe('sin-sesion'))
    expect(fetcher).not.toHaveBeenCalled()
  })
})
