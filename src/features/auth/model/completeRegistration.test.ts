import { configureStore } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchUsers } from '@/api/users'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { filesToDataUrls } from '@/shared/lib/filesToDataUrls'
import catalogReducer, { selectSkills, selectUsers } from '@/store/slices/catalogSlice'
import type { RegisterStep3Values } from '@/widgets/RegisterStep3Form'
import authReducer from './authSlice'
import { completeRegistration } from './completeRegistration'

vi.mock('@/api/users', () => ({ fetchUsers: vi.fn() }))
vi.mock('@/shared/lib/filesToDataUrls', () => ({ filesToDataUrls: vi.fn() }))

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

const createStore = () =>
  configureStore({ reducer: { auth: authReducer, catalog: catalogReducer } })

const register = {
  name: 'Новый пользователь',
  email: '  NEW@EXAMPLE.COM  ',
  password: 'New password!',
  town: 'kazan',
  birthday: '1999-05-12',
  gender: 'unspecified' as const,
  learn: ['languages-english'],
}

const step3: RegisterStep3Values = {
  title: 'Английский для начинающих',
  categoryId: 'languages',
  subcategoryId: 'languages-english',
  description: 'Научу основам английского',
  images: [new File(['x'], 'photo.jpg', { type: 'image/jpeg' })],
}

const readUsers = () => JSON.parse(storage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS) ?? '[]')
const readSkills = () => JSON.parse(storage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_SKILLS) ?? '[]')

let storage: ReturnType<typeof createMemoryStorage>
let uuidCounter: number

beforeEach(() => {
  vi.resetAllMocks()
  uuidCounter = 0
  storage = createMemoryStorage()
  vi.stubGlobal('localStorage', storage)
  vi.stubGlobal('crypto', { randomUUID: () => `uuid-${++uuidCounter}` })
  vi.mocked(fetchUsers).mockResolvedValue([])
  vi.mocked(filesToDataUrls).mockResolvedValue(['data:image/jpeg;base64,photo.jpg'])
})

afterEach(() => vi.unstubAllGlobals())

describe('completeRegistration', () => {
  it('регистрирует пользователя и сразу добавляет его с навыком в каталог', async () => {
    const store = createStore()
    const result = await store.dispatch(completeRegistration({ register, step3 }))

    expect(completeRegistration.fulfilled.match(result)).toBe(true)
    const users = readUsers()
    expect(users).toHaveLength(1)
    expect(readSkills()).toHaveLength(1)
    // пользователь и навык сразу попали в store каталога
    expect(selectUsers(store.getState())).toEqual(users)
    expect(selectSkills(store.getState())).toEqual(readSkills())
  })

  it('привязывает навык к новому пользователю и данным шага 3', async () => {
    const store = createStore()
    await store.dispatch(completeRegistration({ register, step3 }))

    const user = readUsers()[0]
    const skill = readSkills()[0]
    expect(skill.authorId).toBe(user.id)
    expect(skill).toMatchObject({
      title: step3.title,
      description: step3.description,
      type: 'teach',
      category: step3.categoryId,
      subcategory: step3.subcategoryId,
      images: ['data:image/jpeg;base64,photo.jpg'],
    })
  })

  it('отклоняет занятую почту и не создаёт навык', async () => {
    storage.setItem(
      LOCAL_STORAGE_KEYS.REGISTERED_USERS,
      JSON.stringify([
        {
          id: 'taken',
          name: 'Занятый',
          email: 'new@example.com',
          password: 'pw',
          town: 'moscow',
          birthday: '1990-01-01',
          createdAt: '2026-01-01T00:00:00.000Z',
          likedCount: 0,
          description: '',
          gender: 'male',
          learn: [],
          favourites: [],
          avatarUrl: null,
        },
      ]),
    )
    const store = createStore()
    const result = await store.dispatch(completeRegistration({ register, step3 }))

    expect(completeRegistration.rejected.match(result)).toBe(true)
    expect(result.payload).toBe('Пользователь с такой почтой уже зарегистрирован')
    expect(readSkills()).toEqual([])
    expect(selectSkills(store.getState())).toEqual([])
  })

  it('откатывает регистрацию, если сохранение навыка не удалось', async () => {
    vi.mocked(filesToDataUrls).mockRejectedValue(new Error('read error'))
    const store = createStore()
    const result = await store.dispatch(completeRegistration({ register, step3 }))

    expect(completeRegistration.rejected.match(result)).toBe(true)
    // пользователь не остался наполовину созданным
    expect(readUsers()).toEqual([])
    expect(readSkills()).toEqual([])
    expect(store.getState().auth.user).toBeNull()
    expect(selectUsers(store.getState())).toEqual([])
  })
})
