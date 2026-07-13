import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../app/providers/ThemeProvider'
import IngresarPage from '../features/auth/IngresarPage'

/* El resultado del ingreso depende del entorno (VITE_* en .env.local); se
   fija 'sin-backend' para que el aviso probado sea determinista. */
vi.mock('../services/api/auth', () => ({
  iniciarSesion: vi.fn(async () => 'sin-backend'),
}))

function renderIngresar() {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={['/ingresar']}>
        <IngresarPage />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('IngresarPage', () => {
  it('conserva la validación y el acceso al modo desarrollo', async () => {
    const user = userEvent.setup()
    renderIngresar()

    expect(screen.getByRole('link', { name: /explorar en modo desarrollo/i })).toHaveAttribute(
      'href',
      '/panel',
    )

    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText(/correo institucional completo/i)).toBeInTheDocument()
    expect(screen.getByText(/al menos 8 caracteres/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText('Correo institucional'), 'usuario@ucacue.edu.ec')
    await user.type(screen.getByLabelText('Contraseña'), 'password-segura')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText(/ninguna credencial fue enviada/i)).toBeInTheDocument()
  })

  it('permite validar una solicitud de recuperación y volver al ingreso', async () => {
    const user = userEvent.setup()
    renderIngresar()

    await user.click(screen.getByRole('button', { name: /olvidaste tu contraseña/i }))

    expect(
      await screen.findByRole('heading', { name: 'Recuperar contraseña' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explorar en modo desarrollo/i })).toHaveAttribute(
      'href',
      '/panel',
    )

    await user.click(screen.getByRole('button', { name: 'Enviar instrucciones' }))
    expect(screen.getByText(/correo institucional completo/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText('Correo institucional'), 'persona@ucacue.edu.ec')
    await user.click(screen.getByRole('button', { name: 'Enviar instrucciones' }))

    expect(
      await screen.findByRole('heading', { name: 'Solicitud preparada' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/no se envió ningún correo/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Volver a ingresar' }))
    expect(await screen.findByRole('heading', { name: 'Ingresar a SmartGym' })).toBeInTheDocument()
    expect(screen.getByLabelText('Correo institucional')).toHaveValue('persona@ucacue.edu.ec')
  })
})
