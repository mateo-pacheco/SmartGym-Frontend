import { NavLink } from 'react-router-dom'
import { Icon } from '../../components/icons/Icon'
import { NAV_GROUPS } from './navigation'

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV_GROUPS.map((group) => (
        <div key={group.label ?? 'principal'} className="d-grid gap-1">
          {group.label ? <p className="sg-sidenav__group m-0">{group.label}</p> : null}
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="sg-sidenav__link"
              onClick={onNavigate}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </>
  )
}
