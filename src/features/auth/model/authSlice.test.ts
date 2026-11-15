import { configureStore } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchUsers } from '@/api/users'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { AuthUser, RegisterPayload, User } from '@/shared/types'
import catalogReducer from '@/store/slices/catalogSlice'
import authReducer, {
  loginUser,
  logout,
  registerUser,
  selectAuthError,
  selectAuthStatus,
  selectAuthUser,
  selectIsAuthorized,
} from './authSlice'

vi.mock('@/api/users', () => ({ fetchUsers: vi.fn() }))

function createMemoryStorage() {
  const values = new Map<string, string>()
  return {
    get length() {
      return values.size
    },
    key: vi.fn((index: number) => [...values.keys()][index] ?? null),
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      values.delete(key)
    }),
    clear: vi.fn(() => values.clear()),
  } satisfies Storage
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

const seededUser: User = {
  id: 'seeded-user',
  name: 'Иван Петров',
  email: 'ivan@example.com',
  password: 'Secret 123!',
  avatarUrl: null,
  createdAt: '2026-01-01T12:00:00.000Z',
  town: 'moscow',
  birthday: '1993-01-07',
  likedCount: 0,
  description: 'Могу научить фотографии.',
  gender: 'male',
  learn: ['home-houseplants'],
  favourites: [],
}

const registeredUser: User = {
  ...seededUser,
  id: 'registered-user',
  name: 'Мария Соколова',
  email: 'local@example.com',
  password: 'Local password!',
}

const registration: RegisterPayload = {
  name: 'Новый пользователь',
  email: '  NEW@EXAMPLE.COM  ',
  password: 'New password!',
  town: 'kazan',
  birthday: '1999-05-12',
  gender: 'unspecified',
  learn: ['languages-english'],
}

const idleState = { user: null, status: 'idle', error: null, currentRequestId: null }
const createStore = () =>
  configureStore({ reducer: { auth: authReducer, catalog: catalogReducer } })
let storage: ReturnType<typeof createMemoryStorage>

function readAuthUser(): AuthUser | null {
  return JSON.parse(storage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER) ?? 'null')
}

function readRegisteredUsers(): User[] {
  return JSON.parse(storage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS) ?? '[]')
}

function saveRegistry(users: User[]) {
  storage.setItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users))
}

beforeEach(() => {
  vi.resetAllMocks()
  storage = createMemoryStorage()
  vi.stubGlobal('localStorage', storage)
  vi.mocked(fetchUsers).mockResolvedValue([seededUser])
})

afterEach(() => vi.unstubAllGlobals())

describe('authSlice', () => {
  it('начинает без сессии и отдаёт начальные значения через селекторы', () => {
    const store = createStore()

    expect(store.getState().auth).toEqual(idleState)
    expect(selectAuthUser(store.getState())).toBeNull()
    expect(selectIsAuthorized(store.getState())).toBe(false)
    expect(selectAuthStatus(store.getState())).toBe('idle')
    expect(selectAuthError(store.getState())).toBeNull()
  })

  it('читает сессию при создании store и оставляет только публичный snapshot', () => {
    const authUser: AuthUser = {
      id: seededUser.id,
      name: seededUser.name,
      email: seededUser.email,
      token: 'saved-token',
    }
    storage.setItem(
      LOCAL_STORAGE_KEYS.AUTH_USER,
      JSON.stringify({ ...authUser, password: 'must not enter Redux' }),
    )

    const store = createStore()

    expect(store.getState().auth).toEqual({ ...idleState, user: authUser })
    expect(selectAuthUser(store.getState())).toEqual(authUser)
    expect(selectIsAuthorized(store.getState())).toBe(true)
  })

  it('входит по исходному пользователю, нормализует email и сохраняет безопасную сессию', async () => {
    const store = createStore()

    await store.dispatch(
      loginUser({ email: '  IVAN@EXAMPLE.COM  ', password: seededUser.password }),
    )

    const expectedUser = {
      id: seededUser.id,
      name: seededUser.name,
      email: seededUser.email,
      token: 'mock_token_' + seededUser.id,
    }
    expect(selectAuthUser(store.getState())).toEqual(expectedUser)
    expect(selectIsAuthorized(store.getState())).toBe(true)
    expect(selectAuthStatus(store.getState())).toBe('succeeded')
    expect(selectAuthError(store.getState())).toBeNull()
    expect(store.getState().auth.currentRequestId).toBeNull()
    expect(readAuthUser()).toEqual(expectedUser)
  })

  it('входит по пользователю из локального реестра регистраций', async () => {
    saveRegistry([registeredUser])
    vi.mocked(fetchUsers).mockResolvedValue([])
    const store = createStore()

    await store.dispatch(
      loginUser({ email: registeredUser.email.toUpperCase(), password: registeredUser.password }),
    )

    expect(selectAuthUser(store.getState())).toMatchObject({
      id: registeredUser.id,
      name: registeredUser.name,
      email: registeredUser.email,
    })
    expect(readRegisteredUsers()).toEqual([registeredUser])
  })

  it('сравнивает пароль точно и сбрасывает ошибку при повторной загрузке', async () => {
    const store = createStore()
    await store.dispatch(
      loginUser({ email: seededUser.email, password: seededUser.password.toLowerCase() }),
    )
    expect(selectAuthStatus(store.getState())).toBe('failed')
    expect(selectAuthError(store.getState())).toEqual(expect.any(String))
    expect(selectAuthUser(store.getState())).toBeNull()
    expect(readAuthUser()).toBeNull()

    const request = deferred<User[]>()
    vi.mocked(fetchUsers).mockReturnValueOnce(request.promise)
    const pendingLogin = store.dispatch(
      loginUser({ email: seededUser.email, password: seededUser.password }),
    )

    expect(selectAuthStatus(store.getState())).toBe('loading')
    expect(selectAuthError(store.getState())).toBeNull()
    expect(store.getState().auth.currentRequestId).toEqual(expect.any(String))
    request.resolve([seededUser])
    await pendingLogin
    expect(selectAuthStatus(store.getState())).toBe('succeeded')
    expect(store.getState().auth.currentRequestId).toBeNull()
  })

  it('превращает неизвестную ошибку сети в строковую ошибку состояния', async () => {
    vi.mocked(fetchUsers).mockRejectedValue({ status: 503 })
    const store = createStore()

    const result = await store.dispatch(
      loginUser({ email: seededUser.email, password: seededUser.password }),
    )

    expect(loginUser.rejected.match(result)).toBe(true)
    expect(selectAuthStatus(store.getState())).toBe('failed')
    expect(selectAuthError(store.getState())).toEqual(expect.stringMatching(/\S/))
    expect(selectAuthUser(store.getState())).toBeNull()
    expect(store.getState().auth.currentRequestId).toBeNull()
  })

  it('не сообщает об успешном входе, если запись сессии недоступна', async () => {
    storage.setItem.mockImplementation(() => {
      throw new DOMException('Storage is full', 'QuotaExceededError')
    })
    const store = createStore()

    await store.dispatch(loginUser({ email: seededUser.email, password: seededUser.password }))

    expect(selectAuthStatus(store.getState())).toBe('failed')
    expect(selectAuthError(store.getState())).toEqual(expect.stringMatching(/\S/))
    expect(selectAuthUser(store.getState())).toBeNull()
    expect(readAuthUser()).toBeNull()
  })

  it('регистрирует полного пользователя, сохраняет реестр и автоматически входит', async () => {
    saveRegistry([registeredUser])
    const store = createStore()

    await store.dispatch(registerUser(registration))

    const savedUsers = readRegisteredUsers()
    expect(savedUsers).toHaveLength(2)
    expect(savedUsers[0]).toEqual(registeredUser)
    const createdUser = savedUsers[1]
    expect(createdUser).toEqual({
      ...registration,
      id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
      email: 'new@example.com',
      createdAt: expect.any(String),
      avatarUrl: null,
      description: '',
      likedCount: 0,
      favourites: [],
    })
    expect(new Date(createdUser.createdAt).toISOString()).toBe(createdUser.createdAt)
    expect(selectAuthUser(store.getState())).toEqual({
      id: createdUser.id,
      name: registration.name,
      email: 'new@example.com',
      token: 'mock_token_' + createdUser.id,
    })
    expect(readAuthUser()).toEqual(selectAuthUser(store.getState()))
    expect(selectAuthStatus(store.getState())).toBe('succeeded')
  })

  it.each([
    { label: 'существующий реестр', registry: JSON.stringify([registeredUser], null, 2) },
    { label: 'отсутствующий ключ', registry: null },
  ])(
    'восстанавливает $label, если запись сессии после регистрации не удалась',
    async ({ registry }) => {
      if (registry !== null) storage.setItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, registry)
      const write = storage.setItem.getMockImplementation()!
      storage.setItem.mockImplementation((key, value) => {
        if (key === LOCAL_STORAGE_KEYS.AUTH_USER) {
          throw new DOMException('Storage is full', 'QuotaExceededError')
        }
        write(key, value)
      })
      const store = createStore()

      await store.dispatch(registerUser(registration))

      expect(selectAuthStatus(store.getState())).toBe('failed')
      expect(selectAuthError(store.getState())).toEqual(expect.stringMatching(/\S/))
      expect(selectAuthUser(store.getState())).toBeNull()
      expect(readAuthUser()).toBeNull()
      expect(storage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS)).toBe(registry)
    },
  )

  it('отклоняет занятый email из исходного списка независимо от регистра и пробелов', async () => {
    const store = createStore()

    await store.dispatch(registerUser({ ...registration, email: '  IVAN@EXAMPLE.COM  ' }))

    expect(selectAuthStatus(store.getState())).toBe('failed')
    expect(selectAuthError(store.getState())).toEqual(expect.stringMatching(/\S/))
    expect(readRegisteredUsers()).toEqual([])
    expect(readAuthUser()).toBeNull()
  })

  it('отклоняет занятый email из локального реестра, сохраняя прошлые регистрации', async () => {
    saveRegistry([registeredUser])
    const store = createStore()

    await store.dispatch(registerUser({ ...registration, email: '  LOCAL@EXAMPLE.COM  ' }))

    expect(selectAuthStatus(store.getState())).toBe('failed')
    expect(readRegisteredUsers()).toEqual([registeredUser])
    expect(readAuthUser()).toBeNull()
  })

  it('при выходе удаляет только сессию и сбрасывает состояние', async () => {
    saveRegistry([registeredUser])
    storage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(['user-1']))
    const store = createStore()
    await store.dispatch(loginUser({ email: seededUser.email, password: seededUser.password }))

    store.dispatch(logout())

    expect(store.getState().auth).toEqual(idleState)
    expect(readAuthUser()).toBeNull()
    expect(readRegisteredUsers()).toEqual([registeredUser])
    expect(storage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)).toBe(JSON.stringify(['user-1']))
  })

  it('не восстанавливает сессию из ответа входа, завершившегося после выхода', async () => {
    const request = deferred<User[]>()
    vi.mocked(fetchUsers).mockReturnValueOnce(request.promise)
    const store = createStore()
    const pendingLogin = store.dispatch(
      loginUser({ email: seededUser.email, password: seededUser.password }),
    )

    store.dispatch(logout())
    request.resolve([seededUser])
    await pendingLogin

    expect(store.getState().auth).toEqual(idleState)
    expect(readAuthUser()).toBeNull()
  })

  it('не сохраняет регистрацию, если пользователь вышел во время запроса', async () => {
    saveRegistry([registeredUser])
    const request = deferred<User[]>()
    vi.mocked(fetchUsers).mockReturnValueOnce(request.promise)
    const store = createStore()
    const pendingRegistration = store.dispatch(registerUser(registration))

    store.dispatch(logout())
    request.resolve([])
    await pendingRegistration

    expect(store.getState().auth).toEqual(idleState)
    expect(readAuthUser()).toBeNull()
    expect(readRegisteredUsers()).toEqual([registeredUser])
  })

  it('пропускает повторную авторизацию, пока другой запрос выполняется', async () => {
    const request = deferred<User[]>()
    vi.mocked(fetchUsers).mockReturnValue(request.promise)
    const store = createStore()
    const pendingLogin = store.dispatch(
      loginUser({ email: seededUser.email, password: seededUser.password }),
    )
    const pendingRegistration = store.dispatch(registerUser(registration))

    request.resolve([seededUser])
    await Promise.all([pendingLogin, pendingRegistration])

    expect(fetchUsers).toHaveBeenCalledTimes(1)
    expect(selectAuthUser(store.getState())?.id).toBe(seededUser.id)
    expect(selectAuthStatus(store.getState())).toBe('succeeded')
    expect(readRegisteredUsers()).toEqual([])
  })
})
