import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CrudSection } from '../components/data-display/CrudSection'
import { ToastProvider } from '../app/providers/ToastProvider'
import type { ApiData } from '../services/api/useApiData'

interface Item { id: string; nombre: string }

function datos(items: Item[]): ApiData<Item[]> {
  return { estado: 'listo', datos: items, error: null, recargar: vi.fn() }
}

function wrap(ui: React.ReactNode) {
  return render(
    <ToastProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ToastProvider>,
  )
}

const baseProps = {
  titulo: 'Alimentos',
  entidad: 'Alimento',
  illustration: 'plan' as const,
  emptyTitle: 'Catálogo vacío',
  emptyBody: 'Agrega alimentos.',
  idDe: (i: Item) => i.id,
  columnas: [{ key: 'nombre', header: 'Nombre' }],
  fila: (i: Item) => ({ nombre: i.nombre }),
  campos: [{ key: 'nombre', label: 'Nombre', tipo: 'text' as const, requerido: true }],
}

describe('CrudSection', () => {
  it('oculta acciones de gestión a un rol sin permisos', () => {
    wrap(
      <CrudSection<Item>
        {...baseProps}
        datos={datos([{ id: '1', nombre: 'Pollo' }])}
        puedeGestionar={false}
        crear={vi.fn()}
        eliminar={vi.fn()}
      />,
    )
    expect(screen.queryByRole('button', { name: /nuevo alimento/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /eliminar alimento/i })).not.toBeInTheDocument()
  })

  it('muestra el botón de crear a un rol con permisos', () => {
    wrap(
      <CrudSection<Item> {...baseProps} datos={datos([])} puedeGestionar crear={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /nuevo alimento/i })).toBeInTheDocument()
    expect(screen.getByText('Catálogo vacío')).toBeInTheDocument()
  })

  it('crea un registro real y refresca la lista', async () => {
    const user = userEvent.setup()
    const crear = vi.fn().mockResolvedValue({ id: '9', nombre: 'Avena' })
    const d = datos([])
    wrap(<CrudSection<Item> {...baseProps} datos={d} puedeGestionar crear={crear} />)

    await user.click(screen.getByRole('button', { name: /nuevo alimento/i }))
    const input = await screen.findByLabelText(/nombre/i)
    await user.type(input, 'Avena')
    await user.click(screen.getByRole('button', { name: /^crear$/i }))

    await waitFor(() => expect(crear).toHaveBeenCalledWith({ nombre: 'Avena' }))
    await waitFor(() => expect(d.recargar).toHaveBeenCalled())
  })
})
