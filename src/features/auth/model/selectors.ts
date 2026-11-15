import type { RootState } from '@/store'

export const selectIsAuthorized = (state: RootState) => Boolean(state.auth?.isAuthorized)
export const selectCurrentUser = (state: RootState) => state.auth?.user ?? null
