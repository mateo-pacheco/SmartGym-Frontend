import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppButton } from '../actions/AppButton'
import './cookie-consent.scss'

/* Aviso de cookies/almacenamiento local. Aparece una sola vez (la elección
   persiste en localStorage), entra y sale con transición y respeta
   prefers-reduced-motion. No bloquea la página. */

const STORAGE_KEY = 'sg-cookie-consent'
const EXIT_MS = 420

type Phase = 'hidden' | 'visible' | 'leaving'

export function CookieConsent() {
  const [phase, setPhase] = useState<Phase>('hidden')
  const exitTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {
      return
    }
    const t = window.setTimeout(() => setPhase('visible'), 1200)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(exitTimer.current)
    }
  }, [])

  const decide = (choice: 'all' | 'essential') => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      /* Sin almacenamiento disponible: solo se oculta en esta visita. */
    }
    setPhase('leaving')
    exitTimer.current = window.setTimeout(() => setPhase('hidden'), EXIT_MS)
  }

  if (phase === 'hidden') return null

  return (
    <aside
      className={`sg-cookies${phase === 'leaving' ? ' sg-cookies--leaving' : ''}`}
      role="region"
      aria-label="Aviso de privacidad y cookies"
    >
      <span className="sg-cookies__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
          <path
            d="M12 2a10 10 0 1 0 9.95 11c-2.4.5-4.55-1.2-4.75-3.4-2.3.3-4.2-1.7-3.7-3.9C11.6 5.9 10.6 3.9 12 2Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <circle cx="8.6" cy="10.2" r="1.15" fill="currentColor" />
          <circle cx="10.4" cy="15.6" r="1.15" fill="currentColor" />
          <circle cx="15.2" cy="14.4" r="1.15" fill="currentColor" />
        </svg>
      </span>
      <h2 className="sg-cookies__title">Tu privacidad es importante</h2>
      <p className="sg-cookies__body">
        Usamos almacenamiento local para recordar tu sesión y preferencias, como el tema. No
        empleamos rastreadores publicitarios. Conoce más en la{' '}
        <Link to="/administracion/privacidad">política de privacidad</Link>.
      </p>
      <div className="sg-cookies__actions">
        <button type="button" className="sg-cookies__minimal" onClick={() => decide('essential')}>
          Solo esenciales
        </button>
        <AppButton size="sm" onClick={() => decide('all')}>
          Aceptar
        </AppButton>
      </div>
    </aside>
  )
}
