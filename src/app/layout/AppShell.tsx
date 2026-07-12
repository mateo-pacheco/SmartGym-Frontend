import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SkipToContent } from '../../components/navigation/SkipToContent'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { MobileNav } from './MobileNav'
import { SideNav } from './SideNav'
import { TopBar } from './TopBar'

/* Shell persistente: SideNav y TopBar permanecen montados entre rutas.
   El contenido del Outlet entra con un fade breve (MotionEffect de
   Animate UI); la cascada fina la hacen los bloques internos. */
export function AppShell() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      <SkipToContent />
      <div className="sg-shell">
        <SideNav />
        <div className="d-flex flex-column min-vh-100">
          <TopBar onOpenNav={() => setNavOpen(true)} />
          <main id="contenido-principal" className="sg-main flex-grow-1">
            {/* La key vive en el contenido, nunca en el layout. */}
            <MotionEffect
              key={pathname}
              fade
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </MotionEffect>
          </main>
        </div>
      </div>
      <MobileNav show={navOpen} onHide={() => setNavOpen(false)} />
    </>
  )
}
