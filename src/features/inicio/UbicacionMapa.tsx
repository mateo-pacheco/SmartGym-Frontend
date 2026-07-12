import { useState } from 'react'
import { Icon } from '../../components/icons/Icon'

const DESTINATION = 'Av. González Suárez y Araucana, Cuenca, Ecuador'
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(DESTINATION)}&z=16&output=embed`
const DEFAULT_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DESTINATION)}&travelmode=driving`

type LocationState = 'idle' | 'locating' | 'ready' | 'unavailable'

export function UbicacionMapa() {
  const [locationState, setLocationState] = useState<LocationState>('idle')
  const [directionsUrl, setDirectionsUrl] = useState(DEFAULT_DIRECTIONS_URL)

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationState('unavailable')
      return
    }

    setLocationState('locating')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const origin = `${coords.latitude},${coords.longitude}`
        setDirectionsUrl(
          `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(DESTINATION)}&travelmode=driving`,
        )
        setLocationState('ready')
      },
      () => setLocationState('unavailable'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  }

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
              <a
                className="sg-btn sg-btn--primary"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir indicaciones
                <Icon name="flechaDerecha" size={18} />
              </a>
              <button
                className="sg-btn sg-btn--secondary"
                type="button"
                onClick={useCurrentLocation}
                disabled={locationState === 'locating'}
              >
                {locationState === 'locating' ? 'Ubicando…' : 'Usar mi ubicación'}
              </button>
            </div>

            <p className="ubicacion-estado" role="status" aria-live="polite">
              {locationState === 'ready'
                ? 'Origen listo. Abre las indicaciones para ver la ruta.'
                : locationState === 'unavailable'
                  ? 'No se usó tu ubicación. Google Maps puede elegir el punto de partida.'
                  : 'Tu ubicación solo se solicita cuando tú la eliges.'}
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
