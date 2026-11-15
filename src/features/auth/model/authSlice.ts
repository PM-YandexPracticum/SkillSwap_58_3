import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/shared/types'
import type { AuthState } from './types'

export const initialState: AuthState = {
  user: null,
  isAuthorized: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload
      state.isAuthorized = Boolean(action.payload)
    },
    logout: (state) => {
      state.user = null
      state.isAuthorized = false
    },
  },
})

export const { setAuthUser, logout } = authSlice.actions
export default authSlice.reducer
