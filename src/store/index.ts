import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/model/authSlice'
import favoritesReducer from '@/features/favorites/model/favoritesSlice'
import { saveFavorites } from '@/features/favorites/model/favoritesUtils'
import catalogReducer from './slices/catalogSlice'
import filtersReducer from './slices/filtersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    filters: filtersReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

let previousFavorites = store.getState().favorites.byUser

store.subscribe(() => {
  const currentFavorites = store.getState().favorites.byUser

  if (currentFavorites === previousFavorites) return

  previousFavorites = currentFavorites

  try {
    saveFavorites(currentFavorites)
  } catch (error) {
    console.error('Не удалось сохранить избранное:', error)
  }
})
