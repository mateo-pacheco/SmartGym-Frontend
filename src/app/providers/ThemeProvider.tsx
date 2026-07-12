import { useCallback, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import type { ReactNode } from 'react'
import { ThemeContext, type Theme } from './theme-context'

function readInitialTheme(): Theme {
  const current = document.documentElement.getAttribute('data-theme')
  return current === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('sg-theme', theme)
    } catch {
      // Sin acceso a storage: el tema vive solo en la sesión actual.
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    const root = document.documentElement
    const change = () => {
      flushSync(() => {
        setTheme((t) => {
          const next = t === 'light' ? 'dark' : 'light'
          root.setAttribute('data-theme', next)
          return next
        })
      })
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      change()
      return
    }

    if (typeof document.startViewTransition === 'function') {
      // Crossfade nativo entre el snapshot del tema saliente y el entrante.
      document.startViewTransition(change)
      return
    }

    // Fallback: transición de colores acotada mientras cambia el atributo.
    root.classList.add('sg-theme-anim')
    change()
    window.setTimeout(() => root.classList.remove('sg-theme-anim'), 420)
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
