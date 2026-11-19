import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

export type FavoritesStorage = Record<string, string[]>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function getStoredFavorites(): FavoritesStorage {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)

    if (!raw) return {}

    const parsed: unknown = JSON.parse(raw)

    if (!isRecord(parsed)) return {}

    const favorites: FavoritesStorage = {}

    for (const [userId, value] of Object.entries(parsed)) {
      if (Array.isArray(value) && value.every((id) => typeof id === 'string')) {
        favorites[userId] = value
      }
    }

    return favorites
  } catch {
    return {}
  }
}

export function saveFavorites(favorites: FavoritesStorage): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))
}
