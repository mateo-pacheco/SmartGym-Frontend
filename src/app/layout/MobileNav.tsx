import Offcanvas from 'react-bootstrap/Offcanvas'
import brandMark from '../../assets/brand/smartgym-mark.svg'
import { NavLinks } from './NavLinks'

export interface MobileNavProps {
  show: boolean
  onHide: () => void
}

export function MobileNav({ show, onHide }: MobileNavProps) {
  return (
    <Offcanvas show={show} onHide={onHide} placement="start" aria-label="Navegación principal">
      <Offcanvas.Header closeButton closeLabel="Cerrar navegación">
        <Offcanvas.Title className="d-flex align-items-center gap-2">
          <img src={brandMark} alt="" width="28" height="28" />
          SmartGym
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <nav className="d-grid gap-1" aria-label="Módulos">
          <NavLinks onNavigate={onHide} />
        </nav>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
