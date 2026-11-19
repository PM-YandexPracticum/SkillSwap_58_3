import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/model/authSlice'
import favoritesReducer from '@/features/favorites/model/favoritesSlice'
import { saveFavorites } from '@/features/favorites/model/favoritesUtils'
import exchangeReducer from '@/features/exchange/model/exchangeSlice'
import { saveNotifications, saveRequests } from '@/features/exchange/model/exchangeUtils'
import catalogReducer from './slices/catalogSlice'
import filtersReducer from './slices/filtersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exchange: exchangeReducer,
    catalog: catalogReducer,
    filters: filtersReducer,
    favorites: favoritesReducer,
  },
})

let previousExchange = store.getState().exchange
store.subscribe(() => {
  const exchange = store.getState().exchange
  if (exchange.requests !== previousExchange.requests) saveRequests(exchange.requests)
  if (exchange.notifications !== previousExchange.notifications)
    saveNotifications(exchange.notifications)
  previousExchange = exchange
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
