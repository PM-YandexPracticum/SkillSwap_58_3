import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCategories } from '@/api/categories'
import { fetchCities } from '@/api/cities'
import { fetchSkills } from '@/api/skills'
import { fetchUsers } from '@/api/users'
import type { Category, City, Skill, User } from '@/shared/types'
import catalogReducer, {
  loadCatalogData,
  selectCatalogError,
  selectCatalogStatus,
  selectCategories,
  selectCities,
  selectSkills,
  selectUsers,
} from './catalogSlice'

vi.mock('@/api/users', () => ({ fetchUsers: vi.fn() }))
vi.mock('@/api/skills', () => ({ fetchSkills: vi.fn() }))
vi.mock('@/api/categories', () => ({ fetchCategories: vi.fn() }))
vi.mock('@/api/cities', () => ({ fetchCities: vi.fn() }))

const seededUser: User = {
  id: 'seeded-user',
  name: 'Иван',
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

const seededSkill: Skill = {
  id: 'skill-1',
  title: 'Основы фотографии',
  description: 'Курс для начинающих.',
  type: 'teach',
  category: 'creativity',
  subcategory: 'creativity-photography',
  tags: ['фото', 'начинающим'],
  images: [],
  authorId: 'seeded-user',
  createdAt: '2026-02-10T10:00:00.000Z',
}

const seededCategory: Category = {
  id: 'creativity',
  name: 'Творчество и искусство',
  subcategories: [{ id: 'creativity-photography', name: 'Фотография' }],
}

const seededCity: City = { id: 'moscow', name: 'Москва' }

const createStore = () => configureStore({ reducer: { catalog: catalogReducer } })

describe('catalogSlice', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(fetchUsers).mockResolvedValue([seededUser])
    vi.mocked(fetchSkills).mockResolvedValue([seededSkill])
    vi.mocked(fetchCategories).mockResolvedValue([seededCategory])
    vi.mocked(fetchCities).mockResolvedValue([seededCity])
  })

  it('имеет корректное начальное состояние и отдаёт его через селекторы', () => {
    const store = createStore()
    expect(store.getState().catalog).toEqual({
      users: [],
      skills: [],
      categories: [],
      cities: [],
      status: 'idle',
      error: null,
    })
    expect(selectUsers(store.getState())).toEqual([])
    expect(selectSkills(store.getState())).toEqual([])
    expect(selectCategories(store.getState())).toEqual([])
    expect(selectCities(store.getState())).toEqual([])
    expect(selectCatalogStatus(store.getState())).toBe('idle')
    expect(selectCatalogError(store.getState())).toBeNull()
  })

  it('переводит статус в loading сразу после dispatch (pending)', () => {
    const store = createStore()
    const pending = store.dispatch(loadCatalogData())
    expect(selectCatalogStatus(store.getState())).toBe('loading')
    expect(selectCatalogError(store.getState())).toBeNull()
    return pending
  })

  it('сохраняет данные и ставит succeeded при fulfilled', async () => {
    const store = createStore()
    await store.dispatch(loadCatalogData())
    expect(selectUsers(store.getState())).toEqual([seededUser])
    expect(selectSkills(store.getState())).toEqual([seededSkill])
    expect(selectCategories(store.getState())).toEqual([seededCategory])
    expect(selectCities(store.getState())).toEqual([seededCity])
    expect(selectCatalogStatus(store.getState())).toBe('succeeded')
    expect(selectCatalogError(store.getState())).toBeNull()
  })

  it('переходит в failed с текстом ошибки при rejected', async () => {
    vi.mocked(fetchUsers).mockRejectedValue(new Error('Network error'))
    const store = createStore()
    await store.dispatch(loadCatalogData())
    expect(selectCatalogStatus(store.getState())).toBe('failed')
    expect(selectCatalogError(store.getState())).toBe('Network error')
    // данные остаются пустыми предыдущего состояния не было
    expect(selectUsers(store.getState())).toEqual([])
  })

  it('не делает повторных запросов при status === succeeded', async () => {
    const store = createStore()
    await store.dispatch(loadCatalogData())
    await store.dispatch(loadCatalogData())
    await store.dispatch(loadCatalogData())
    expect(fetchUsers).toHaveBeenCalledTimes(1)
    expect(fetchSkills).toHaveBeenCalledTimes(1)
    expect(fetchCategories).toHaveBeenCalledTimes(1)
    expect(fetchCities).toHaveBeenCalledTimes(1)
    expect(selectCatalogStatus(store.getState())).toBe('succeeded')
  })
})
