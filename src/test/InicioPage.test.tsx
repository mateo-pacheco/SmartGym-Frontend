import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../app/providers/ThemeProvider'
import InicioPage from '../features/inicio/InicioPage'

function renderInicio() {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={['/inicio']}>
        <InicioPage />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('InicioPage', () => {
  it('usa una card física solo para NFC y visuales propios en los demás módulos', () => {
    renderInicio()

    const nfcVisual = document.querySelector('.sgm-parallax--nfc')
    const iotVisual = document.querySelector('.sgm-visual-tilt--iot')
    const medicalVisual = document.querySelector('.sgm-visual-tilt--medical')
    const agendaVisual = document.querySelector('.sgm-visual-tilt--agenda')

    for (const visual of [nfcVisual, iotVisual, medicalVisual, agendaVisual]) {
      expect(visual).not.toBeNull()
      expect(visual?.closest('.mod-row__visual')).toHaveClass('mod-row__visual--custom')
    }

    expect(document.querySelectorAll('.sgm-card')).toHaveLength(1)
    expect(nfcVisual?.querySelector('.sgm-card')).not.toBeNull()
    expect(iotVisual?.querySelector('.sgm-card')).toBeNull()
    expect(medicalVisual?.querySelector('.sgm-card')).toBeNull()
    expect(agendaVisual?.querySelector('.sgm-card')).toBeNull()
  })

  it('renderiza el lockup institucional, las secciones ancladas y el mapa', () => {
    renderInicio()

    // Lockup: universidad + producto (aparece en nav y footer).
    expect(screen.getAllByText('SmartGym').length).toBeGreaterThan(0)

    // Secciones ancladas por el nav.
    for (const id of ['modulos', 'flujos', 'seguridad', 'ubicacion']) {
      expect(document.getElementById(id)).not.toBeNull()
    }

    // Mapa real: dirección, iframe de Google Maps e indicaciones externas.
    expect(screen.getByText('Av. González Suárez y Araucana')).toBeInTheDocument()
    expect(screen.getByTitle(/Google Maps: SmartGym/i)).toBeInTheDocument()
    const comoLlegar = screen.getByRole('link', { name: /abrir indicaciones/i })
    expect(comoLlegar).toHaveAttribute('href', expect.stringContaining('google.com/maps'))
    expect(comoLlegar).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(screen.getByRole('button', { name: /usar mi ubicación/i })).toBeInTheDocument()
  })

  it('el desplegable de módulos abre al click y lista los módulos', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    renderInicio()

    const trigger = screen.getByRole('button', { name: /módulos/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    // jsdom no ejecuta la animación GSAP: los ítems existen aunque aún "ocultos".
    const items = screen.getAllByRole('menuitem', { hidden: true })
    const labels = items.map((el) => el.textContent)
    expect(labels).toContain('Acceso NFC')
    expect(labels).toContain('Reportes')
    expect(items).toHaveLength(11)
  })

  it('el footer desarrolla enlaces de plataforma y recorrido', () => {
    renderInicio()
    expect(screen.getByRole('link', { name: 'Centro de control' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Auditoría' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Flujos críticos' })).toHaveAttribute(
      'href',
      '#flujos',
    )
    expect(screen.getByText(/©\s*2026/)).toBeInTheDocument()
  })
})
