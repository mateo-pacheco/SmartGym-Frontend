import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UbicacionMapa } from '../features/inicio/UbicacionMapa'

const DESTINO = encodeURIComponent('Av. González Suárez y Araucana, Cuenca, Ecuador')

/** Ventana simulada: capturamos la URL final que se abre. */
function stubVentana() {
  const ventana = { closed: false, location: { replace: vi.fn() } }
  const open = vi.fn(() => ventana as unknown as Window)
  vi.stubGlobal('open', open)
  return { ventana, open }
}

function stubGeolocation(impl: Partial<Geolocation>) {
  Object.defineProperty(navigator, 'geolocation', { value: impl, configurable: true })
}

beforeEach(() => {
  vi.stubGlobal('open', vi.fn())
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('UbicacionMapa', () => {
  it('muestra el mapa embebido de Google', () => {
    render(<UbicacionMapa />)
    const mapa = screen.getByTitle('Google Maps: SmartGym UCACUE en Cuenca')
    expect(mapa).toHaveAttribute('src', expect.stringContaining('google.com/maps'))
    expect(mapa.getAttribute('src')).toContain('output=embed')
  })

  it('«Abrir indicaciones» calcula la ubicación en el momento y traza la ruta desde ahí', async () => {
    const user = userEvent.setup()
    const { ventana } = stubVentana()
    // Se tipa con la firma real para poder inspeccionar las opciones (maximumAge).
    const getCurrentPosition: Geolocation['getCurrentPosition'] = vi.fn((ok) =>
      ok({ coords: { latitude: -2.9001, longitude: -79.0059 } } as GeolocationPosition),
    )
    stubGeolocation({ getCurrentPosition } as unknown as Geolocation)

    render(<UbicacionMapa />)
    await user.click(screen.getByRole('link', { name: /abrir indicaciones/i }))

    // Se pide una lectura fresca (sin caché) en ese instante.
    expect(getCurrentPosition).toHaveBeenCalled()
    expect(vi.mocked(getCurrentPosition).mock.calls[0][2]).toMatchObject({ maximumAge: 0 })

    await waitFor(() => expect(ventana.location.replace).toHaveBeenCalled())
    const url = ventana.location.replace.mock.calls[0][0] as string
    expect(url).toContain('origin=-2.9001%2C-79.0059')
    expect(url).toContain(`destination=${DESTINO}`)
    expect(await screen.findByText(/ruta calculada desde tu ubicación actual/i)).toBeInTheDocument()
  })

  it('si el usuario niega la ubicación, abre la ruta igual pero sin origen', async () => {
    const user = userEvent.setup()
    const { ventana } = stubVentana()
    stubGeolocation({
      getCurrentPosition: vi.fn((_ok: PositionCallback, err?: PositionErrorCallback) =>
        err?.({ code: 1, message: 'denied' } as GeolocationPositionError),
      ),
    } as unknown as Geolocation)

    render(<UbicacionMapa />)
    await user.click(screen.getByRole('link', { name: /abrir indicaciones/i }))

    await waitFor(() => expect(ventana.location.replace).toHaveBeenCalled())
    const url = ventana.location.replace.mock.calls[0][0] as string
    expect(url).toContain(`destination=${DESTINO}`)
    expect(url).not.toContain('origin=')
    expect(await screen.findByText(/no se pudo usar tu ubicación/i)).toBeInTheDocument()
  })

  it('«Usar mi ubicación» deja el origen listo para la ruta', async () => {
    const user = userEvent.setup()
    stubGeolocation({
      getCurrentPosition: vi.fn((ok: PositionCallback) =>
        ok({ coords: { latitude: 1, longitude: 2 } } as GeolocationPosition),
      ),
    } as unknown as Geolocation)

    render(<UbicacionMapa />)
    await user.click(screen.getByRole('button', { name: /usar mi ubicación/i }))
    expect(await screen.findByText(/ruta calculada desde tu ubicación actual/i)).toBeInTheDocument()
  })
})
