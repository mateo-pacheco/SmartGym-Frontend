import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../services/api/runtimeEnv', () => ({
  runtimeEnv: { apiUrl: 'https://backend.test', supabaseUrl: 'https://supabase.test', supabaseAnonKey: 'anon' },
}))

import { RutaAutorizada } from '../app/layout/RutaAutorizada'
import { setApiToken, clearApiToken } from '../services/api/http'
import { authStore } from '../services/api/authStore'

function jwt(rol: string) {
  const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${b64({ alg: 'none' })}.${b64({ sub: 'u', app_metadata: { roles: [rol] } })}.s`
}

/* Monta la ruta indicada tal como lo hace AppShell: el gate envuelve al
   contenido del módulo. */
function renderRuta(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route element={<RutaAutorizada />}>
          <Route path="*" element={<p>contenido del módulo</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

const moduloVisible = () => screen.queryByText('contenido del módulo')
// El texto también aparece en el <title> del SVG: se acota al párrafo.
const denegado = () => screen.queryByText('Acceso restringido', { selector: 'p' })

beforeEach(() => {
  window.sessionStorage.clear()
  window.localStorage.clear()
})
afterEach(() => {
  clearApiToken()
  authStore.refrescar()
  vi.clearAllMocks()
})

describe('RutaAutorizada · acceso por URL', () => {
  const restringidas = [
    '/analisis/reportes',
    '/atencion/deportistas',
    '/atencion/alertas',
    '/operacion/accesos',
    '/administracion/auditoria',
    '/administracion/privacidad',
  ]

  it.each(restringidas)('ESTUDIANTE no entra a %s escribiendo la URL', (ruta) => {
    setApiToken(jwt('ESTUDIANTE'))
    authStore.refrescar()
    renderRuta(ruta)
    expect(moduloVisible()).not.toBeInTheDocument()
    expect(denegado()).toBeInTheDocument()
  })

  it.each(restringidas)('ADMINISTRADOR sí entra a %s', (ruta) => {
    setApiToken(jwt('ADMINISTRADOR'))
    authStore.refrescar()
    renderRuta(ruta)
    expect(moduloVisible()).toBeInTheDocument()
    expect(denegado()).not.toBeInTheDocument()
  })

  const abiertas = ['/panel', '/operacion/maquinas', '/operacion/agenda', '/atencion/planes', '/experiencias/xr']

  it.each(abiertas)('ESTUDIANTE conserva el acceso a %s', (ruta) => {
    setApiToken(jwt('ESTUDIANTE'))
    authStore.refrescar()
    renderRuta(ruta)
    expect(moduloVisible()).toBeInTheDocument()
  })
})
