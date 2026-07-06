import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../components/data-display/StatusBadge'

describe('StatusBadge', () => {
  it('comunica el estado con texto además de color e icono', () => {
    render(<StatusBadge tone="danger" label="Bloqueada" />)
    const badge = screen.getByText('Bloqueada')
    expect(badge.closest('.sg-status')).toHaveClass('sg-status--danger')
  })
})
