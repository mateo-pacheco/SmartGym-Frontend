import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RequireSession } from '../app/router/RequireSession'
import { ThemeProvider } from '../app/providers/ThemeProvider'
import { setApiToken, clearApiToken } from '../services/api/http'
import { authStore } from '../services/api/authStore'
import { cerrarSesion } from '../services/api/auth'

function jwt() {
  const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${b64({ alg: 'none' })}.${b64({ sub: 'u', app_metadata: { roles: ['ADMINISTRADOR'] } })}.s`
}

function App() {
  return (
    <ThemeProvider>
      <MemoryRouter initialEntries={['/panel']}>
        <Routes>
          <Route path="/ingresar" element={<p>Pantalla de ingreso</p>} />
          <Route element={<RequireSession />}>
            <Route path="/panel" element={<p>Contenido protegido</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )
}

beforeEach(() => {
  window.sessionStorage.clear()
  window.localStorage.clear()
  clearApiToken()
  authStore.refrescar()
})
afterEach(() => {
  clearApiToken()
  authStore.refrescar()
})

describe('RequireSession (protección de rutas)', () => {
  it('sin sesión redirige a /ingresar', () => {
    render(<App />)
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument()
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  })

  it('con sesión válida muestra el contenido protegido', () => {
    setApiToken(jwt())
    authStore.refrescar()
    render(<App />)
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })

  it('al cerrar sesión, la guarda reacciona y expulsa al ingreso', () => {
    setApiToken(jwt())
    authStore.refrescar()
    render(<App />)
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
    act(() => {
      cerrarSesion()
    })
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument()
  })
})
