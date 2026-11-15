import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchUsers } from '@/api/users'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { AuthUser, User } from '@/shared/types'
import {
  clearAuthUser,
  getAuthUser,
  getRegisteredUsers,
  isEmailTaken,
  saveAuthUser,
  saveRegisteredUser,
} from './authUtils'

vi.mock('@/api/users', () => ({ fetchUsers: vi.fn() }))

const user: User = {
  id: 'local-user',
  name: 'Анна',
  email: 'anna@example.com',
  password: 'LocalPassword123!',
  birthday: '1995-05-20',
  gender: 'female',
  town: 'moscow',
  learn: ['languages-english'],
  avatarUrl: null,
  description: '',
  createdAt: '2026-11-15T10:00:00.000Z',
  likedCount: 0,
  favourites: [],
}

const authUser: AuthUser = {
  id: user.id,
  name: user.name,
  email: user.email,
  token: 'mock_token_' + user.id,
}

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
  vi.resetAllMocks()
  storage = createStorage()
  vi.stubGlobal('localStorage', storage)
  vi.mocked(fetchUsers).mockResolvedValue([])
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getAuthUser', () => {
  it('восстанавливает только поля сессии', () => {
    storage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify({ ...user, ...authUser }))

    expect(getAuthUser()).toEqual(authUser)
    expect(getAuthUser()).not.toHaveProperty('password')
  })

  it.each([null, [], {}, { ...authUser, token: 1 }, { ...authUser, email: '' }])(
    'не восстанавливает сессию неверной формы: %j',
    (value) => {
      storage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(value))

      expect(getAuthUser()).toBeNull()
    },
  )

  it('возвращает null без сессии, при повреждённом JSON и ошибке чтения', () => {
    expect(getAuthUser()).toBeNull()
    storage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, '{broken')
    expect(getAuthUser()).toBeNull()
    vi.mocked(storage.getItem).mockImplementationOnce(() => {
      throw new Error('Storage unavailable')
    })
    expect(getAuthUser()).toBeNull()
  })
})

describe('saveAuthUser и clearAuthUser', () => {
  it('сохраняет mock-токен без пароля и остальных полей User', () => {
    expect(saveAuthUser(user)).toEqual(authUser)
    expect(JSON.parse(storage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)!)).toEqual(authUser)
  })

  it('выход удаляет только сессию, сохраняя регистрации и избранное', () => {
    saveAuthUser(user)
    saveRegisteredUser(user)
    storage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, '["another-user"]')

    clearAuthUser()

    expect(getAuthUser()).toBeNull()
    expect(getRegisteredUsers()).toEqual([user])
    expect(storage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)).toBe('["another-user"]')
  })

  it('передаёт ошибку записи вызывающему коду', () => {
    vi.mocked(storage.setItem).mockImplementationOnce(() => {
      throw new Error('Storage is full')
    })

    expect(() => saveAuthUser(user)).toThrow('Storage is full')
  })
})

describe('getRegisteredUsers и saveRegisteredUser', () => {
  it('возвращает пустой список без данных, при повреждённом JSON и неверном контейнере', () => {
    expect(getRegisteredUsers()).toEqual([])
    for (const value of ['{broken', '{}', 'null', '"text"']) {
      storage.setItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, value)
      expect(getRegisteredUsers()).toEqual([])
    }
  })

  it('пропускает некорректные записи, сохраняя валидных пользователей', () => {
    storage.setItem(
      LOCAL_STORAGE_KEYS.REGISTERED_USERS,
      JSON.stringify([
        null,
        [],
        {},
        { ...user, password: 42 },
        { ...user, gender: 'unknown' },
        { ...user, learn: [1] },
        { ...user, likedCount: -1 },
        user,
      ]),
    )

    expect(getRegisteredUsers()).toEqual([user])
  })

  it('возвращает пустой список при недоступном storage', () => {
    vi.mocked(storage.getItem).mockImplementationOnce(() => {
      throw new Error('Storage unavailable')
    })

    expect(getRegisteredUsers()).toEqual([])
  })

  it('добавляет регистрацию, сохраняя предыдущие', () => {
    const secondUser: User = { ...user, id: 'second-user', email: 'second@example.com' }
    saveRegisteredUser(user)
    saveRegisteredUser(secondUser)

    expect(getRegisteredUsers()).toEqual([user, secondUser])
  })

  it('передаёт ошибку записи вызывающему коду', () => {
    vi.mocked(storage.setItem).mockImplementationOnce(() => {
      throw new Error('Storage is full')
    })

    expect(() => saveRegisteredUser(user)).toThrow('Storage is full')
  })
})

describe('isEmailTaken', () => {
  it('проверяет исходных пользователей без учёта регистра и пробелов', async () => {
    vi.mocked(fetchUsers).mockResolvedValue([{ ...user, email: ' ANNA@Example.com ' }])

    await expect(isEmailTaken(' anna@example.COM ')).resolves.toBe(true)
    expect(fetchUsers).toHaveBeenCalledTimes(1)
  })

  it('проверяет зарегистрированных пользователей и свободный email', async () => {
    saveRegisteredUser({ ...user, email: ' ANNA@Example.com ' })

    await expect(isEmailTaken(' anna@example.COM ')).resolves.toBe(true)
    await expect(isEmailTaken('new@example.com')).resolves.toBe(false)
  })

  it('передаёт ошибку загрузки вызывающему коду', async () => {
    vi.mocked(fetchUsers).mockRejectedValueOnce(new Error('Network unavailable'))

    await expect(isEmailTaken('anna@example.com')).rejects.toThrow('Network unavailable')
  })
})
