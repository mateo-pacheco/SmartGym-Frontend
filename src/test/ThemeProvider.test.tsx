import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../app/providers/ThemeProvider'
import { useTheme } from '../app/providers/useTheme'

function Sonda() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button type="button" onClick={toggleTheme}>
      tema actual: {theme}
    </button>
  )
}

describe('ThemeProvider', () => {
  it('alterna data-theme en el documento sin recargar', async () => {
    document.documentElement.setAttribute('data-theme', 'light')
    render(
      <ThemeProvider>
        <Sonda />
      </ThemeProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: /tema actual/ }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
