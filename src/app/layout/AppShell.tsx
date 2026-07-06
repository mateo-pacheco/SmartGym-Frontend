import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SkipToContent } from '../../components/navigation/SkipToContent'
import { MobileNav } from './MobileNav'
import { SideNav } from './SideNav'
import { TopBar } from './TopBar'

/* Shell persistente: SideNav y TopBar permanecen montados entre rutas.
   Solo el contenido del Outlet transiciona (opacity + translateY ≤180ms). */
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
            <div key={pathname} className="sg-route-enter">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <MobileNav show={navOpen} onHide={() => setNavOpen(false)} />
    </>
  )
}
