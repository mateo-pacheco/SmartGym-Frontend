import * as React from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
  type UseInViewOptions,
  type Transition,
  type Variant,
} from 'motion/react'

/* MotionEffect de Animate UI (animate-ui.com, MIT) adaptado a SmartGym:
   sin Tailwind, con soporte de prefers-reduced-motion (solo fade breve).
   Anima únicamente transform / opacity / filter — nunca layout. */

type MotionEffectProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode
  className?: string
  transition?: Transition
  delay?: number
  inView?: boolean
  inViewMargin?: UseInViewOptions['margin']
  inViewOnce?: boolean
  blur?: string | boolean
  slide?:
    | {
        direction?: 'up' | 'down' | 'left' | 'right'
        offset?: number
      }
    | boolean
  fade?: { initialOpacity?: number; opacity?: number } | boolean
  zoom?:
    | {
        initialScale?: number
        scale?: number
      }
    | boolean
}

function MotionEffect({
  ref,
  children,
  className,
  transition = { type: 'spring', stiffness: 200, damping: 24 },
  delay = 0,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  blur = false,
  slide = false,
  fade = false,
  zoom = false,
  ...props
}: MotionEffectProps) {
  const localRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref as React.Ref<HTMLDivElement | null>, () => localRef.current)

  const reducedMotion = useReducedMotion()

  /* Pestañas ocultas y renderers headless (crawlers SEO) pausan rAF: si el
     documento no está visible al montar, el contenido entra ya visible en
     lugar de quedar atascado en el estado oculto de la animación. */
  const [skipEntrance] = React.useState(
    () => typeof document !== 'undefined' && document.visibilityState === 'hidden',
  )

  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  })
  const isInView = !inView || inViewResult

  const hiddenVariant: Variant = {}
  const visibleVariant: Variant = {}

  if (slide && !reducedMotion) {
    const offset = typeof slide === 'boolean' ? 100 : (slide.offset ?? 100)
    const direction = typeof slide === 'boolean' ? 'left' : (slide.direction ?? 'left')
    const axis = direction === 'up' || direction === 'down' ? 'y' : 'x'
    hiddenVariant[axis] = direction === 'left' || direction === 'up' ? -offset : offset
    visibleVariant[axis] = 0
  }

  if (fade || reducedMotion) {
    hiddenVariant.opacity =
      typeof fade === 'object' ? (fade.initialOpacity ?? 0) : 0
    visibleVariant.opacity = typeof fade === 'object' ? (fade.opacity ?? 1) : 1
  }

  if (zoom && !reducedMotion) {
    hiddenVariant.scale = typeof zoom === 'boolean' ? 0.5 : (zoom.initialScale ?? 0.5)
    visibleVariant.scale = typeof zoom === 'boolean' ? 1 : (zoom.scale ?? 1)
  }

  if (blur && !reducedMotion) {
    hiddenVariant.filter = typeof blur === 'boolean' ? 'blur(10px)' : `blur(${blur})`
    visibleVariant.filter = 'blur(0px)'
  }

  const activeTransition: Transition = reducedMotion
    ? { duration: 0.15, ease: 'easeOut' }
    : transition

  /* Sin AnimatePresence: no hay animaciones de salida (la ruta reemplaza el
     contenido) y en React 18 provoca warnings de `ref` como prop. */
  return (
    <motion.div
      ref={localRef}
      data-slot="motion-effect"
      initial={skipEntrance ? false : 'hidden'}
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: hiddenVariant,
        visible: visibleVariant,
      }}
      transition={{
        ...activeTransition,
        delay: reducedMotion ? 0 : ((transition?.delay as number | undefined) ?? 0) + delay,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { MotionEffect, type MotionEffectProps }
