import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppButton } from '../components/actions/AppButton'

describe('AppButton', () => {
  it('renderiza un botón con la variante indicada', () => {
    render(<AppButton variant="danger">Bloquear manilla</AppButton>)
    const btn = screen.getByRole('button', { name: 'Bloquear manilla' })
    expect(btn).toHaveClass('sg-btn--danger')
    expect(btn).toHaveAttribute('type', 'button')
  })

  it('renderiza un Link de React Router cuando recibe `to` (sin recarga de página)', () => {
    render(
      <MemoryRouter>
        <AppButton to="/panel">Ingresar a la plataforma</AppButton>
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: 'Ingresar a la plataforma' })
    expect(link).toHaveAttribute('href', '/panel')
  })

  it('deshabilita la acción cuando el contrato no existe', () => {
    render(<AppButton disabled>Registrar manilla</AppButton>)
    expect(screen.getByRole('button', { name: 'Registrar manilla' })).toBeDisabled()
  })
})
