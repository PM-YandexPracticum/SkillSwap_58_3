import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/model/authSlice'
import catalogReducer from './slices/catalogSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
