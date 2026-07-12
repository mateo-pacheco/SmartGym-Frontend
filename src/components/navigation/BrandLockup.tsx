import { Link } from 'react-router-dom'
import logo from '../../assets/brand/ucacue-logo.png'

export interface BrandLockupProps {
  /** sm: offcanvas y espacios angostos; md: navbars y sidebar. */
  size?: 'sm' | 'md'
  className?: string
  /** Cierra contenedores (offcanvas) al navegar. */
  onNavigate?: () => void
}

/* Lockup institucional: escudo UC + nombre de la universidad | divisor | producto,
   siguiendo la cabecera del sitio institucional UCACUE. */
export function BrandLockup({ size = 'md', className, onNavigate }: BrandLockupProps) {
  const cls = ['sg-lockup', `sg-lockup--${size}`, className].filter(Boolean).join(' ')
  return (
    <Link to="/inicio" className={cls} onClick={onNavigate}>
      <img src={logo} alt="" />
      <span className="sg-lockup__uni">
        Universidad
        <br />
        Católica
        <br />
        de Cuenca
      </span>
      <span className="sg-lockup__divider" aria-hidden="true" />
      <span className="sg-lockup__name">SmartGym</span>
    </Link>
  )
}
