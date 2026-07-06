import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../icons/Icon'

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: Variant
  size?: Size
  icon?: IconName
  iconEnd?: IconName
  children?: ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { to?: undefined }

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
    /** Navegación interna con React Router (nunca recarga de página). */
    to: string
  }

export type AppButtonProps = ButtonAsButton | ButtonAsLink

export function AppButton(props: AppButtonProps) {
  const { variant = 'primary', size = 'md', icon, iconEnd, children, className = '', ...rest } = props
  const cls = [
    'sg-btn',
    `sg-btn--${variant}`,
    size !== 'md' ? `sg-btn--${size}` : '',
    !children ? 'sg-btn--icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon ? <Icon name={icon} size={size === 'sm' ? 16 : 18} /> : null}
      {children}
      {iconEnd ? <Icon name={iconEnd} size={size === 'sm' ? 16 : 18} /> : null}
    </>
  )

  if ('to' in props && typeof props.to === 'string') {
    const { to, ...linkRest } = rest as Omit<ButtonAsLink, keyof BaseProps>
    void to
    return (
      <Link to={props.to} className={cls} {...linkRest}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={cls}
      {...(rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)}
    >
      {content}
    </button>
  )
}
