import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/model/authSlice'
import exchangeReducer from '@/features/exchange/model/exchangeSlice'
import { saveNotifications, saveRequests } from '@/features/exchange/model/exchangeUtils'
import catalogReducer from './slices/catalogSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exchange: exchangeReducer,
    catalog: catalogReducer,
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
