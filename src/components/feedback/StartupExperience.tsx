import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import './startup-experience.scss'

interface StartupExperienceProps {
  children: ReactNode
}

type Frame =
  | { kind: 'photo'; src: string; pos?: string; zoom?: number; duotone?: boolean }
  | { kind: 'dot' }

type Phase = 'loading' | 'preview' | 'expanding' | 'fading' | 'done'

const CAMPUS = '/media/smartgym-campus-960.webp'
const PISCINA = '/media/smartgym-piscina-960.webp'

/* Nueve capas, como la pila de K95. Las mismas fotos cambian de encuadre
   para evitar descargas adicionales y mantener la secuencia ligera. */
const LAYERS: Frame[] = [
  { kind: 'photo', src: CAMPUS },
  { kind: 'photo', src: PISCINA },
  { kind: 'photo', src: CAMPUS, pos: '24% 30%', zoom: 1.7 },
  { kind: 'photo', src: PISCINA, pos: '70% 28%', zoom: 1.45 },
  { kind: 'photo', src: CAMPUS, pos: '68% 42%', zoom: 1.55, duotone: true },
  { kind: 'photo', src: PISCINA, pos: '76% 55%', zoom: 1.9, duotone: true },
  { kind: 'photo', src: CAMPUS, pos: '42% 66%', zoom: 1.35 },
  { kind: 'photo', src: PISCINA, pos: '30% 70%', zoom: 1.5 },
  { kind: 'dot' },
]

const TARGET_WIDTHS = LAYERS.map((_, index) => 84 + index * 2)

/* Tiempos medidos en la implementación de referencia de k95.it. */
const LAYER_DURATION_MS = 667
const LAYER_STAGGER_MS = 187
const COUNTER_DURATION_MS = 2160
const SEQUENCE_TOTAL_MS = 2380
const PREVIEW_AT_MS = SEQUENCE_TOTAL_MS + 140
const EXPAND_AT_MS = PREVIEW_AT_MS + 60
const PATCH_DURATION_MS = 1000
const FADE_AT_MS = EXPAND_AT_MS + PATCH_DURATION_MS
const DONE_AT_MS = FADE_AT_MS + 420

function preload(srcs: string[], timeoutMs: number) {
  const uniqueSources = [...new Set(srcs)]
  const all = Promise.all(
    uniqueSources.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = src
        }),
    ),
  )
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs))
  return Promise.race([all, timeout])
}

function LayerContent({ frame }: { frame: Frame }) {
  if (frame.kind === 'dot') {
    return (
      <div className="sg-boot__fill">
        <span className="sg-boot__dot" />
      </div>
    )
  }

  return (
    <div className={`sg-boot__photo${frame.duotone ? ' sg-boot__photo--duotone' : ''}`}>
      <img
        src={frame.src}
        alt=""
        style={{
          objectPosition: frame.pos ?? 'center',
          transform: frame.zoom ? `scale(${frame.zoom})` : undefined,
        }}
      />
    </div>
  )
}

export function StartupExperience({ children }: StartupExperienceProps) {
  const reduceMotion = useReducedMotion()
  const stackRef = useRef<HTMLDivElement>(null)
  const [skipIntro] = useState(
    () => typeof document !== 'undefined' && document.visibilityState === 'hidden',
  )
  const [phase, setPhase] = useState<Phase>(skipIntro ? 'done' : 'loading')
  const [started, setStarted] = useState(skipIntro)
  const [counter, setCounter] = useState(skipIntro ? 100 : 0)
  const [patchScale, setPatchScale] = useState({ x: 1, y: 1 })

  useEffect(() => {
    if (skipIntro) return

    let cancelled = false
    let animationFrame: number | null = null
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms))
    }

    if (reduceMotion) {
      setStarted(true)
      setCounter(100)
      setPhase('preview')
      later(() => setPhase('expanding'), 60)
      later(() => setPhase('fading'), 220)
      later(() => setPhase('done'), 420)

      return () => timers.forEach(clearTimeout)
    }

    const startSequence = () => {
      if (cancelled) return
      setStarted(true)

      const startedAt = performance.now()
      let previousCounter = -1
      const updateCounter = (now: number) => {
        if (cancelled) return
        const elapsed = now - startedAt
        const nextCounter = Math.min(100, Math.round((elapsed / COUNTER_DURATION_MS) * 100))

        if (nextCounter !== previousCounter) {
          previousCounter = nextCounter
          setCounter(nextCounter)
        }

        if (elapsed < COUNTER_DURATION_MS) {
          animationFrame = window.requestAnimationFrame(updateCounter)
        } else {
          setCounter(100)
          animationFrame = null
        }
      }

      animationFrame = window.requestAnimationFrame(updateCounter)
      later(() => setPhase('preview'), PREVIEW_AT_MS)
      later(() => setPhase('expanding'), EXPAND_AT_MS)
      later(() => setPhase('fading'), FADE_AT_MS)
      later(() => setPhase('done'), DONE_AT_MS)
    }

    void preload(
      LAYERS.flatMap((frame) => (frame.kind === 'photo' ? [frame.src] : [])),
      600,
    ).then(startSequence)

    return () => {
      cancelled = true
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
      timers.forEach(clearTimeout)
    }
  }, [reduceMotion, skipIntro])

  useLayoutEffect(() => {
    if (phase !== 'preview') return
    const stack = stackRef.current
    if (!stack) return

    const rect = stack.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const farthestX = Math.max(centerX, window.innerWidth - centerX)
    const farthestY = Math.max(centerY, window.innerHeight - centerY)

    setPatchScale({
      x: Math.max(1, (farthestX * 2 * 1.04) / rect.width),
      y: Math.max(1, (farthestY * 2 * 1.04) / rect.height),
    })
  }, [phase])

  const patchVisible = phase === 'preview' || phase === 'expanding' || phase === 'fading'
  const patchExpanded = phase === 'expanding' || phase === 'fading'

  return (
    <>
      <div className="sg-startup-content">{children}</div>

      <AnimatePresence initial={false}>
        {phase !== 'done' ? (
          <motion.div
            className={`sg-boot sg-boot--${phase}`}
            role="status"
            aria-label="Cargando SmartGym"
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === 'fading' ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: phase === 'fading' ? 0.42 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div ref={stackRef} className="sg-boot__stack" aria-hidden="true">
              {LAYERS.map((frame, index) => (
                <motion.div
                  key={`${frame.kind}-${index}`}
                  className={`sg-boot__layer${
                    index === LAYERS.length - 1 ? ' sg-boot__layer--final' : ''
                  }`}
                  style={{
                    width: `${TARGET_WIDTHS[index]}%`,
                    zIndex: index + 1,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: started ? 1 : 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : LAYER_DURATION_MS / 1000,
                    delay: reduceMotion ? 0 : (index * LAYER_STAGGER_MS) / 1000,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <LayerContent frame={frame} />
                </motion.div>
              ))}

              <div className="sg-boot__counter">[{counter}]</div>
            </div>

            <div className="sg-boot__patch-anchor" aria-hidden="true">
              <motion.div
                className="sg-boot__patch"
                initial={false}
                animate={{
                  opacity: patchVisible ? 1 : 0,
                  scaleX: patchExpanded ? patchScale.x : 1,
                  scaleY: patchExpanded ? patchScale.y : 1,
                }}
                transition={
                  patchExpanded
                    ? { duration: PATCH_DURATION_MS / 1000, ease: [0.87, 0, 0.13, 1] }
                    : { duration: 0 }
                }
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
