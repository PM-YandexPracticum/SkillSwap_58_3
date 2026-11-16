import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthorized } from '../model/selectors'
import type { AuthLocationState } from '../model/types'

export const PrivateRoute = () => {
  const isAuthorized = useAppSelector(selectIsAuthorized)
  const location = useLocation()

  if (!isAuthorized) {
    const state: AuthLocationState = { from: location }
    return <Navigate to={ROUTES.LOGIN} state={state} replace />
  }

  return <Outlet />
}
