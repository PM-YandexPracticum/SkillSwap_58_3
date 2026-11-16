import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import type { AuthLocationState } from './types'

export const useAuthRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(() => {
    const state = location.state as AuthLocationState | null
    const from = state?.from || ROUTES.HOME
    navigate(from, { replace: true })
  }, [location.state, navigate])
}
