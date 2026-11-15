import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthorized } from './selectors'
import type { AuthLocationState } from './types'

export const useRequireAuth = () => {
  const isAuthorized = useAppSelector(selectIsAuthorized)
  const navigate = useNavigate()
  const location = useLocation()

  const requireAuth = (action: () => void) => {
    if (isAuthorized) {
      action()
    } else {
      const state: AuthLocationState = { from: location }
      navigate(ROUTES.LOGIN, { state })
    }
  }

  return Object.assign(requireAuth, { requireAuth })
}
