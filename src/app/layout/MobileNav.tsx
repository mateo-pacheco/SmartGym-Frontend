import Offcanvas from 'react-bootstrap/Offcanvas'
import { BrandLockup } from '../../components/navigation/BrandLockup'
import { NavLinks } from './NavLinks'

export interface MobileNavProps {
  show: boolean
  onHide: () => void
}

export function MobileNav({ show, onHide }: MobileNavProps) {
  return (
    <Offcanvas show={show} onHide={onHide} placement="start" aria-label="Navegación principal">
      <Offcanvas.Header closeButton closeLabel="Cerrar navegación">
        <Offcanvas.Title>
          <BrandLockup size="sm" onNavigate={onHide} />
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
