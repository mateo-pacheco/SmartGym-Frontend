import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 }

interface ModuleTiltProps {
  children: ReactNode
  className?: string
  planeClassName?: string
  glare?: boolean
}

export function ModuleTilt({
  children,
  className = '',
  planeClassName = '',
  glare = false,
}: ModuleTiltProps) {
  const planeRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  /* El tilt solo tiene sentido con puntero fino: en táctiles el dedo que
     hace scroll dispararía pointermove y whileHover de forma errática. */
  const [finePointer] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )
  const interactive = finePointer && !reducedMotion

  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(pointerY, [0, 1], [13, -3]), SPRING)
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-20, 4]), SPRING)
  const glareX = useTransform(pointerX, (value) => `${value * 100}%`)
  const glareY = useTransform(pointerY, (value) => `${value * 100}%`)
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, var(--mc-glare, transparent), transparent 48%)`

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const plane = planeRef.current
    if (!plane || !interactive) return

    const rect = plane.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width)
    pointerY.set((event.clientY - rect.top) / rect.height)
  }

  const handlePointerLeave = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  return (
    <div className={`sgm-tilt ${className}`.trim()} aria-hidden="true">
      <motion.div
        ref={planeRef}
        className={`sgm-tilt__plane ${planeClassName}`.trim()}
        onPointerMove={interactive ? handlePointerMove : undefined}
        onPointerLeave={interactive ? handlePointerLeave : undefined}
        whileHover={interactive ? { scale: 1.02 } : undefined}
        style={interactive ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
      >
        {glare && interactive ? (
          <motion.div className="sgm-tilt__glare" style={{ background: glareBackground }} />
        ) : null}
        {children}
      </motion.div>
    </div>
  )
}
