import { useLocation } from 'react-router-dom'
import { AppButton } from '../../components/actions/AppButton'
import { ThemeToggle } from '../../components/navigation/ThemeToggle'
import { findNavItem } from './navigation'

export function TopBar({ onOpenNav }: { onOpenNav: () => void }) {
  const { pathname } = useLocation()
  const current = findNavItem(pathname)

  return (
    <div className="sg-topbar">
      <span className="d-lg-none">
        <AppButton variant="ghost" icon="menu" onClick={onOpenNav} aria-label="Abrir navegación" />
      </span>
      <p className="sg-topbar__context m-0">{current ? current.label : 'SmartGym'}</p>
      <div className="ms-auto d-flex align-items-center gap-2">
        <span className="d-none d-md-inline-flex">
          <AppButton variant="tertiary" size="sm" to="/inicio">
            Ver presentación
          </AppButton>
        </span>
        <span className="d-md-none">
          <AppButton
            variant="ghost"
            icon="inicio"
            to="/inicio"
            aria-label="Ver presentación de SmartGym"
            title="Ver presentación"
          />
        </span>
        <ThemeToggle />
      </div>
    </div>
  )
}
