import { useId } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Icon } from '../../components/icons/Icon'
import { useAuth } from '../../services/api/useAuth'
import { NAV_GROUPS } from './navigation'

/* Estado activo con pill compartido (patrón MotionHighlight de Animate UI):
   el fondo se desliza entre enlaces al navegar. layoutId único por instancia
   porque SideNav y MobileNav pueden convivir montados. */
export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pillId = useId()
  const reducedMotion = useReducedMotion()
  const { roles } = useAuth()
  const groups = NAV_GROUPS
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || item.roles.some((role) => roles.includes(role))),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <>
      {groups.map((group) => (
        <div key={group.label ?? 'principal'} className="d-grid gap-1">
          {group.label ? <p className="sg-sidenav__group m-0">{group.label}</p> : null}
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="sg-sidenav__link"
              onClick={onNavigate}
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <motion.span
                      layoutId={`sg-nav-pill-${pillId}`}
                      className="sg-nav-pill"
                      aria-hidden="true"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 350, damping: 32 }
                      }
                    />
                  ) : null}
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </>
  )
}
