import { BrandLockup } from '../../components/navigation/BrandLockup'
import { NavLinks } from './NavLinks'

export function SideNav() {
  return (
    <aside className="sg-sidenav d-none d-lg-flex" aria-label="Navegación principal">
      <BrandLockup size="sm" className="sg-sidenav__brand" />
      <nav className="d-grid gap-1" aria-label="Módulos">
        <NavLinks />
      </nav>
    </aside>
  )
}
