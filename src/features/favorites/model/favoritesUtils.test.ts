import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { getStoredFavorites, saveFavorites } from './favoritesUtils'

function createStorage(): Storage {
  const values = new Map<string, string>()

  return {
    get length() {
      return values.size
    },
    clear: vi.fn(() => values.clear()),
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(values.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => {
      values.delete(key)
    }),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value)
    }),
  }
}

let storage: Storage

beforeEach(() => {
  storage = createStorage()
  vi.stubGlobal('localStorage', storage)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getStoredFavorites', () => {
  it('возвращает пустой объект, если данных нет', () => {
    expect(getStoredFavorites()).toEqual({})
  })

  it('восстанавливает избранное разных пользователей', () => {
    const favorites = {
      'user-02': ['user-04', 'user-13'],
      'user-03': ['user-05'],
    }

    storage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))

    expect(getStoredFavorites()).toEqual(favorites)
  })

  it('сохраняет пустой список пользователя', () => {
    storage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify({ 'user-02': [] }))

    expect(getStoredFavorites()).toEqual({ 'user-02': [] })
  })

  it('обрабатывает повреждённые данные', () => {
    storage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, '{broken')

    expect(getStoredFavorites()).toEqual({})
  })

  it('пропускает записи с неправильным форматом', () => {
    storage.setItem(
      LOCAL_STORAGE_KEYS.FAVORITES,
      JSON.stringify({
        'user-02': ['user-04'],
        'user-03': 'user-05',
        'user-04': [123],
      }),
    )

    expect(getStoredFavorites()).toEqual({
      'user-02': ['user-04'],
    })
  })
})

describe('saveFavorites', () => {
  it('сохраняет избранное в localStorage', () => {
    const favorites = {
      'user-02': ['user-04'],
    }

    saveFavorites(favorites)

    expect(getStoredFavorites()).toEqual(favorites)
  })
})
