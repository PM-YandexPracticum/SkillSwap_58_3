import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getStoredFavorites } from './favoritesUtils'

interface FavoritesState {
  byUser: Record<string, string[]>
}

const initialState: FavoritesState = {
  byUser: getStoredFavorites(),
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    initializeFavorites(state, action: PayloadAction<{ userId: string; favoriteIds: string[] }>) {
      const { userId, favoriteIds } = action.payload

      if (Object.prototype.hasOwnProperty.call(state.byUser, userId)) {
        return
      }

      state.byUser[userId] = [...favoriteIds]
    },
    setFavorites(state, action: PayloadAction<{ userId: string; ids: string[] }>) {
      const { userId, ids } = action.payload

      state.byUser[userId] = [...ids]
    },
    toggleFavorite(state, action: PayloadAction<{ userId: string; favoriteId: string }>) {
      const { userId, favoriteId } = action.payload
      const favoriteIds = state.byUser[userId] ?? []

      if (favoriteIds.includes(favoriteId)) {
        state.byUser[userId] = favoriteIds.filter((id) => id !== favoriteId)
      } else {
        state.byUser[userId] = [...favoriteIds, favoriteId]
      }
    },
  },
})

export const { initializeFavorites, setFavorites, toggleFavorite } = favoritesSlice.actions

export default favoritesSlice.reducer

const EMPTY_FAVORITES: string[] = []

type FavoritesSelectorState = {
  auth: {
    user: {
      id: string
    } | null
  }
  favorites: FavoritesState
}

export const selectFavoriteIds = (state: FavoritesSelectorState): string[] => {
  const userId = state.auth.user?.id

  if (!userId) return EMPTY_FAVORITES

  return state.favorites.byUser[userId] ?? EMPTY_FAVORITES
}
