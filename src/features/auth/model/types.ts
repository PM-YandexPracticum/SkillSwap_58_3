import type { Location } from 'react-router-dom'
import type { AuthUser } from '@/shared/types'

export interface AuthLocationState {
  from?: Location | string
}

export interface AuthState {
  user: AuthUser | null
  isAuthorized: boolean
}
