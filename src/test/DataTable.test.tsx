import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from '../components/data-display/DataTable'

const columnas = [
  { key: 'nombre', header: 'Nombre' },
  { key: 'valor', header: 'Valor' },
]

const filas = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ nombre: `Fila ${i + 1}`, valor: String(i + 1) }))

describe('DataTable', () => {
  it('pagina con una medida predefinida en lugar de crecer hasta abajo', () => {
    render(<DataTable caption="Listado" columns={columnas} rows={filas(24)} pageSize={8} />)
    expect(screen.getAllByRole('row')).toHaveLength(1 + 8) // encabezado + página
    expect(screen.getByText('1–8 de 24')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 3' })).toBeInTheDocument()
  })

  it('navega entre páginas numeradas', async () => {
    const user = userEvent.setup()
    render(<DataTable caption="Listado" columns={columnas} rows={filas(24)} pageSize={8} />)
    await user.click(screen.getByRole('button', { name: 'Página 3' }))
    expect(screen.getByText('17–24 de 24')).toBeInTheDocument()
    expect(screen.getByText('Fila 17')).toBeInTheDocument()
    expect(screen.queryByText('Fila 1')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toBeDisabled()
  })

  it('no muestra controles cuando todo cabe en una página', () => {
    render(<DataTable caption="Listado" columns={columnas} rows={filas(5)} pageSize={8} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(1 + 5)
  })
})
