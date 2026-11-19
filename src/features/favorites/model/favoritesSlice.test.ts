import { describe, expect, it, vi } from 'vitest'
import favoritesReducer, {
  initializeFavorites,
  setFavorites,
  toggleFavorite,
  selectFavoriteIds,
} from './favoritesSlice'

vi.mock('./favoritesUtils', () => ({
  getStoredFavorites: () => ({}),
}))

describe('favoritesSlice', () => {
  it('инициализирует избранное из моковых данных', () => {
    const initialState = { byUser: {} }

    const state = favoritesReducer(
      initialState,
      initializeFavorites({
        userId: 'user-02',
        favoriteIds: ['user-04', 'user-13'],
      }),
    )

    expect(state.byUser['user-02']).toEqual(['user-04', 'user-13'])
  })

  it('добавляет пользователя в избранное', () => {
    const initialState = {
      byUser: { 'user-02': ['user-04'] },
    }

    const state = favoritesReducer(
      initialState,
      toggleFavorite({ userId: 'user-02', favoriteId: 'user-13' }),
    )

    expect(state.byUser['user-02']).toEqual(['user-04', 'user-13'])
  })

  it('удаляет пользователя из избранного', () => {
    const initialState = {
      byUser: { 'user-02': ['user-04', 'user-13'] },
    }

    const state = favoritesReducer(
      initialState,
      toggleFavorite({ userId: 'user-02', favoriteId: 'user-04' }),
    )

    expect(state.byUser['user-02']).toEqual(['user-13'])
  })

  it('не перезаписывает существующий список данными из моков', () => {
    const initialState = {
      byUser: { 'user-02': [] as string[] },
    }

    const state = favoritesReducer(
      initialState,
      initializeFavorites({
        userId: 'user-02',
        favoriteIds: ['user-04', 'user-13'],
      }),
    )

    expect(state.byUser['user-02']).toEqual([])
  })

  it('изменяет избранное только указанного пользователя', () => {
    const initialState = {
      byUser: {
        'user-02': ['user-04'],
        'user-03': ['user-05'],
      },
    }

    const state = favoritesReducer(
      initialState,
      toggleFavorite({ userId: 'user-02', favoriteId: 'user-13' }),
    )

    expect(state.byUser['user-02']).toEqual(['user-04', 'user-13'])
    expect(state.byUser['user-03']).toEqual(['user-05'])
  })

  it('заменяет список через setFavorites', () => {
    const initialState = {
      byUser: { 'user-02': ['user-04'] },
    }

    const state = favoritesReducer(
      initialState,
      setFavorites({ userId: 'user-02', ids: ['user-13'] }),
    )

    expect(state.byUser['user-02']).toEqual(['user-13'])
  })
})

describe('selectFavoriteIds', () => {
  it('возвращает избранное авторизованного пользователя', () => {
    const state = {
      auth: {
        user: {
          id: 'user-02',
          name: 'Мария',
          email: 'maria@example.com',
          token: 'mock',
        },
        status: 'idle',
        error: null,
        currentRequestId: null,
      },
      favorites: {
        byUser: {
          'user-02': ['user-04', 'user-13'],
          'user-03': ['user-05'],
        },
      },
    }

    expect(selectFavoriteIds(state)).toEqual(['user-04', 'user-13'])
  })

  it('возвращает пустой список для гостя', () => {
    const state = {
      auth: {
        user: null,
        status: 'idle',
        error: null,
        currentRequestId: null,
      },
      favorites: {
        byUser: {
          'user-02': ['user-04'],
        },
      },
    }

    expect(selectFavoriteIds(state)).toEqual([])
  })
})
