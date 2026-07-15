import { useRef, useState } from 'react'
import { Icon } from '../../components/icons/Icon'

const DESTINATION = 'Av. González Suárez y Araucana, Cuenca, Ecuador'
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(DESTINATION)}&z=16&output=embed`

/** Ruta sin origen: Google Maps decide el punto de partida. */
const URL_SIN_ORIGEN = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DESTINATION)}&travelmode=driving`

const urlDesde = (lat: number, lon: number) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${lat},${lon}`)}&destination=${encodeURIComponent(DESTINATION)}&travelmode=driving`

type LocationState = 'idle' | 'locating' | 'ready' | 'unavailable'

/** Posición reciente admitida al pulsar «Abrir indicaciones» (2 min). */
const FRESCURA_MS = 120_000

export function UbicacionMapa() {
  const [locationState, setLocationState] = useState<LocationState>('idle')
  const posicion = useRef<{ lat: number; lon: number; en: number } | null>(null)

  /** Pide la posición actual en este instante (sin usar caché del navegador). */
  const pedirPosicion = () =>
    new Promise<{ lat: number; lon: number } | null>((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const p = { lat: coords.latitude, lon: coords.longitude }
          posicion.current = { ...p, en: Date.now() }
          resolve(p)
        },
        () => resolve(null),
        // maximumAge: 0 => se recalcula en el momento, no se reutiliza una lectura vieja.
        { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 },
      )
    })

  const usarMiUbicacion = async () => {
    setLocationState('locating')
    const p = await pedirPosicion()
    setLocationState(p ? 'ready' : 'unavailable')
  }

  const abrirIndicaciones = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    // La pestaña se abre dentro del gesto del usuario para que el navegador no
    // la bloquee; su URL se completa cuando se resuelve la ubicación.
    const ventana = window.open('', '_blank')
    const abrir = (url: string) => {
      if (ventana && !ventana.closed) ventana.location.replace(url)
      else window.open(url, '_blank', 'noopener,noreferrer')
    }

    // Si ya hay una posición reciente (por «Usar mi ubicación»), se usa directo.
    const reciente = posicion.current
    if (reciente && Date.now() - reciente.en < FRESCURA_MS) {
      setLocationState('ready')
      abrir(urlDesde(reciente.lat, reciente.lon))
      return
    }

    setLocationState('locating')
    const p = await pedirPosicion()
    if (p) {
      setLocationState('ready')
      abrir(urlDesde(p.lat, p.lon))
    } else {
      // Sin permiso o sin soporte: se abre la ruta igual, sin origen.
      setLocationState('unavailable')
      abrir(URL_SIN_ORIGEN)
    }
  }

  const mensaje =
    locationState === 'locating'
      ? 'Calculando tu ubicación…'
      : locationState === 'ready'
        ? 'Ruta calculada desde tu ubicación actual.'
        : locationState === 'unavailable'
          ? 'No se pudo usar tu ubicación; Google Maps te pedirá el punto de partida.'
          : 'Tu ubicación solo se solicita cuando tú la eliges.'

  return (
    <section id="ubicacion" className="inicio-section inicio-ubicacion" aria-labelledby="ubicacion-titulo">
      <div className="inicio-section__inner">
        <div className="ubicacion-grid">
          <div className="ubicacion-info" data-reveal>
            <h2 id="ubicacion-titulo">Dónde encontrarnos</h2>
            <p className="inicio-section__lead">
              Campus deportivo de la Universidad Católica de Cuenca.
            </p>
            <address className="ubicacion-direccion">
              <span className="ubicacion-direccion__icono" aria-hidden="true">
                <Icon name="escudo" size={20} />
              </span>
              <span>
                <strong>Av. González Suárez y Araucana</strong>
                Cuenca, Ecuador
              </span>
            </address>

            <div className="ubicacion-actions">
              {/* href real como respaldo (sin JS o al abrir en pestaña nueva). */}
              <a
                className="sg-btn sg-btn--primary"
                href={URL_SIN_ORIGEN}
                target="_blank"
                rel="noopener noreferrer"
                onClick={abrirIndicaciones}
                aria-busy={locationState === 'locating'}
              >
                {locationState === 'locating' ? 'Calculando ruta…' : 'Abrir indicaciones'}
                <Icon name="flechaDerecha" size={18} />
              </a>
              <button
                className="sg-btn sg-btn--secondary"
                type="button"
                onClick={usarMiUbicacion}
                disabled={locationState === 'locating'}
              >
                {locationState === 'locating' ? 'Ubicando…' : 'Usar mi ubicación'}
              </button>
            </div>

            <p className="ubicacion-estado" role="status" aria-live="polite">
              {mensaje}
            </p>
          </div>

          <figure className="ubicacion-mapa" data-reveal>
            <iframe
              src={MAP_EMBED_URL}
              title="Google Maps: SmartGym UCACUE en Cuenca"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <figcaption>SmartGym · Campus deportivo UCACUE</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
