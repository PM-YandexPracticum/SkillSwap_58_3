import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthorized } from './selectors'
import type { AuthLocationState } from './types'

export const useRequireAuth = () => {
  const isAuthorized = useAppSelector(selectIsAuthorized)
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (action: () => void) => {
      if (isAuthorized) {
        action()
      } else {
        const state: AuthLocationState = { from: location }
        navigate(ROUTES.LOGIN, { state })
      }
    },
    [isAuthorized, location, navigate],
  )
}
