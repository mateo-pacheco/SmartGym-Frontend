import { Outlet, ScrollRestoration } from 'react-router-dom'
import { PlatformTransitionProvider } from '../../components/feedback/PlatformTransition'

export function Root() {
  return (
    <PlatformTransitionProvider>
      <ScrollRestoration />
      <Outlet />
    </PlatformTransitionProvider>
  )
}
