import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { BikeSprite } from './BikeSprite'
import './platform-transition.scss'

/* Transición de ingreso a la plataforma: velo de color de marca que cubre
   la pantalla (wipe ascendente, estilo k95.it) con la bicicleta pedaleando,
   navega cubierto y revela la nueva vista. Balanceada: ~1.5s en total.
   Las fases avanzan por timeouts (no por callbacks de animación) para que
   la navegación nunca dependa de un rAF pausado. */

type Phase = 'idle' | 'cover' | 'reveal'

const COVER_MS = 460
const RIDE_MS = 440
const REVEAL_MS = 520

const PlatformTransitionContext = createContext<(to: string) => void>(() => {})

// eslint-disable-next-line react-refresh/only-export-components
export function usePlatformTransition() {
  return useContext(PlatformTransitionContext)
}

export function PlatformTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const busyRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  const enter = useCallback(
    (to: string) => {
      if (busyRef.current) return
      busyRef.current = true

      if (reduceMotion) {
        navigate(to)
        busyRef.current = false
        return
      }

      const later = (fn: () => void, ms: number) => {
        timersRef.current.push(window.setTimeout(fn, ms))
      }

      setPhase('cover')
      later(() => navigate(to), COVER_MS + RIDE_MS)
      later(() => setPhase('reveal'), COVER_MS + RIDE_MS + 120)
      later(() => {
        setPhase('idle')
        busyRef.current = false
      }, COVER_MS + RIDE_MS + 120 + REVEAL_MS)
    },
    [navigate, reduceMotion],
  )

  return (
    <PlatformTransitionContext.Provider value={enter}>
      {children}
      {phase !== 'idle' ? (
        <motion.div
          className="sg-enter-veil"
          aria-hidden="true"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: phase === 'cover' ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)' }}
          transition={{
            duration: (phase === 'cover' ? COVER_MS : REVEAL_MS) / 1000,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <motion.div
            className="sg-enter-veil__content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase === 'cover' ? 1 : 0, y: phase === 'cover' ? 0 : -8 }}
            transition={{ duration: 0.28, ease: 'easeOut', delay: phase === 'cover' ? 0.18 : 0 }}
          >
            <BikeSprite className="sg-enter-veil__bike" />
            <span className="sg-enter-veil__label">SmartGym</span>
          </motion.div>
        </motion.div>
      ) : null}
    </PlatformTransitionContext.Provider>
  )
}
