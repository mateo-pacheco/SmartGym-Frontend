import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../services/api/runtimeEnv', () => ({
  runtimeEnv: { apiUrl: 'https://backend.test', supabaseUrl: 'https://supabase.test', supabaseAnonKey: 'anon' },
}))

import { BotonesReporte } from '../components/actions/BotonesReporte'
import { setApiToken, clearApiToken } from '../services/api/http'
import { authStore } from '../services/api/authStore'

function jwt(rol: string) {
  const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${b64({ alg: 'none' })}.${b64({ sub: 'u', app_metadata: { roles: [rol] } })}.s`
}

function renderBotones() {
  return render(<BotonesReporte pdf={vi.fn()} excel={vi.fn()} />)
}

const botonesVisibles = () => screen.queryByRole('button', { name: 'PDF' })

beforeEach(() => {
  window.sessionStorage.clear()
  window.localStorage.clear()
})
afterEach(() => {
  clearApiToken()
  authStore.refrescar()
  vi.clearAllMocks()
})

describe('BotonesReporte · roles', () => {
  it.each(['ADMINISTRADOR', 'MEDICO', 'ENTRENADOR'])('%s puede exportar', (rol) => {
    setApiToken(jwt(rol))
    authStore.refrescar()
    renderBotones()
    expect(botonesVisibles()).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Excel' })).toBeInTheDocument()
  })

  it('ESTUDIANTE no ve los botones de exportación', () => {
    setApiToken(jwt('ESTUDIANTE'))
    authStore.refrescar()
    renderBotones()
    expect(botonesVisibles()).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Excel' })).not.toBeInTheDocument()
  })

  it('sin sesión tampoco se exporta', () => {
    authStore.refrescar()
    renderBotones()
    expect(botonesVisibles()).not.toBeInTheDocument()
  })

  it('permitido=false nunca amplía el permiso del rol', () => {
    setApiToken(jwt('ADMINISTRADOR'))
    authStore.refrescar()
    render(<BotonesReporte pdf={vi.fn()} excel={vi.fn()} permitido={false} />)
    expect(botonesVisibles()).not.toBeInTheDocument()
  })
})
