import * as React from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'

/* RippleButton de Animate UI (animate-ui.com, MIT) adaptado a SmartGym:
   primitiva y wrapper fusionados (sin Slot ni contexto), color de onda en
   currentColor y escalas de hover/tap sobrias para un producto operativo.
   Con prefers-reduced-motion no hay onda ni escala. */

type Ripple = {
  id: number
  x: number
  y: number
}

type RippleButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  children?: React.ReactNode
  hoverScale?: number
  tapScale?: number
  rippleColor?: string
  rippleScale?: number
}

function RippleButton({
  ref,
  onClick,
  hoverScale = 1.02,
  tapScale = 0.97,
  rippleColor = 'currentColor',
  rippleScale = 12,
  disabled,
  style,
  children,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  React.useImperativeHandle(ref as React.Ref<HTMLButtonElement | null>, () => buttonRef.current)

  const reducedMotion = useReducedMotion()

  const createRipple = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const newRipple: Ripple = {
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)
  }, [])

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!reducedMotion) createRipple(event)
      onClick?.(event)
    },
    [createRipple, onClick, reducedMotion],
  )

  const interactive = !disabled && !reducedMotion

  return (
    <motion.button
      ref={buttonRef}
      data-slot="ripple-button"
      onClick={handleClick}
      disabled={disabled}
      whileTap={interactive ? { scale: tapScale } : undefined}
      whileHover={interactive ? { scale: hoverScale } : undefined}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.35 }}
          animate={{ scale: rippleScale, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            pointerEvents: 'none',
            width: 20,
            height: 20,
            backgroundColor: rippleColor,
            top: ripple.y - 10,
            left: ripple.x - 10,
          }}
        />
      ))}
    </motion.button>
  )
}

export { RippleButton, type RippleButtonProps }
