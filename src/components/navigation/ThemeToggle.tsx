import { useTheme } from '../../app/providers/useTheme'
import { AppButton } from '../actions/AppButton'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const next = theme === 'light' ? 'oscuro' : 'claro'
  return (
    <AppButton
      variant="ghost"
      icon={theme === 'light' ? 'luna' : 'sol'}
      onClick={toggleTheme}
      aria-label={`Cambiar a tema ${next}`}
      title={`Cambiar a tema ${next}`}
    />
  )
}
