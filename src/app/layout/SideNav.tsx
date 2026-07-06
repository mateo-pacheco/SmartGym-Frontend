import { Link } from 'react-router-dom'
import brandMark from '../../assets/brand/smartgym-mark.svg'
import { NavLinks } from './NavLinks'

export function SideNav() {
  return (
    <aside className="sg-sidenav d-none d-lg-flex" aria-label="Navegación principal">
      <Link to="/inicio" className="sg-sidenav__brand">
        <img src={brandMark} alt="" width="34" height="34" />
        <span className="sg-sidenav__brand-name">
          SmartGym
          <span className="sg-sidenav__brand-sub">UCACUE · Plataforma deportiva</span>
        </span>
      </Link>
      <nav className="d-grid gap-1" aria-label="Módulos">
        <NavLinks />
      </nav>
    </aside>
  )
}
