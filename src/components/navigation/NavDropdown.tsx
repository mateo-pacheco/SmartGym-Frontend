import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { Icon, type IconName } from '../icons/Icon'

export interface NavDropdownItem {
  to: string
  label: string
  icon?: IconName
}

export interface NavDropdownProps {
  label: string
  items: NavDropdownItem[]
  /** Clase del botón disparador (hereda el estilo de los enlaces de la nav). */
  triggerClassName?: string
}

/* Desplegable de navegación con apertura suave (autoAlpha + translateY, ease-out).
   Cierra con Escape, click fuera y al navegar; flechas para recorrer opciones. */
export function NavDropdown({ label, items, triggerClassName }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(false)
  const hoverCloseRef = useRef<number>()
  const menuId = useId()

  /* Hover solo en punteros finos: en táctil el click sigue siendo el gesto. */
  const hoverCapable = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const onHoverOpen = () => {
    if (!hoverCapable()) return
    window.clearTimeout(hoverCloseRef.current)
    setOpen(true)
  }

  const onHoverClose = () => {
    if (!hoverCapable()) return
    window.clearTimeout(hoverCloseRef.current)
    hoverCloseRef.current = window.setTimeout(() => setOpen(false), 140)
  }

  useEffect(() => () => window.clearTimeout(hoverCloseRef.current), [])

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (open) {
      menu.dataset.open = 'true'
      if (reduce) {
        gsap.set(menu, { autoAlpha: 1, y: 0 })
        return
      }
      const links = menu.querySelectorAll('a')
      const tl = gsap.timeline()
      tl.fromTo(
        menu,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power3.out' },
      ).fromTo(
        links,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out', stagger: 0.02 },
        '-=0.14',
      )
      return () => {
        tl.kill()
      }
    }
    if (reduce) {
      gsap.set(menu, { autoAlpha: 0 })
      delete menu.dataset.open
      return
    }
    const tween = gsap.to(menu, {
      autoAlpha: 0,
      y: 8,
      duration: 0.16,
      ease: 'power2.in',
      onComplete: () => {
        delete menu.dataset.open
      },
    })
    return () => {
      tween.kill()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const moveFocus = (e: ReactKeyboardEvent, step: 1 | -1) => {
    const links = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])
    if (links.length === 0) return
    e.preventDefault()
    const current = links.indexOf(document.activeElement as HTMLAnchorElement)
    links[(current + step + links.length) % links.length]?.focus()
  }

  return (
    <div
      ref={rootRef}
      className="sg-dropdown"
      onPointerEnter={onHoverOpen}
      onPointerLeave={onHoverClose}
    >
      <button
        ref={triggerRef}
        type="button"
        className={['sg-dropdown__trigger', triggerClassName].filter(Boolean).join(' ')}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (!open) setOpen(true)
            else moveFocus(e, 1)
          }
        }}
      >
        {label}
        <Icon name="chevronAbajo" size={15} className="sg-dropdown__chevron" />
      </button>
      <div
        ref={menuRef}
        id={menuId}
        className="sg-dropdown__menu"
        role="menu"
        aria-label={label}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') moveFocus(e, 1)
          if (e.key === 'ArrowUp') moveFocus(e, -1)
        }}
      >
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            role="menuitem"
            className="sg-dropdown__item"
            onClick={() => setOpen(false)}
          >
            {item.icon ? <Icon name={item.icon} size={18} /> : null}
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
