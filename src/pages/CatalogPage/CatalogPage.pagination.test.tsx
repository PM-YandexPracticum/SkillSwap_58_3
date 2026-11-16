import { act, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Category, City, Skill, User } from '@/shared/types'
import CatalogPage from './index'

const USERS_COUNT = 30
const PAGE_SIZE = 6
const LOAD_DELAY_MS = 1000

const categories: Category[] = [
  { id: 'creativity', name: 'Творчество', subcategories: [{ id: 'photo', name: 'Фото' }] },
]
const cities: City[] = [{ id: 'moscow', name: 'Москва' }]

const users: User[] = Array.from({ length: USERS_COUNT }, (_, index) => ({
  id: `user-${index + 1}`,
  name: `Пользователь ${index + 1}`,
  email: `user${index + 1}@example.com`,
  avatarUrl: null,
  createdAt: new Date(2026, 0, index + 1).toISOString(),
  password: '',
  town: 'moscow',
  birthday: '1990-01-01',
  likedCount: index,
  description: '',
  gender: 'male',
  learn: ['photo'],
  favourites: [],
}))

const skills: Skill[] = users.map((user) => ({
  id: `skill-${user.id}`,
  title: `Навык ${user.id}`,
  description: '',
  type: 'teach',
  category: 'creativity',
  subcategory: 'photo',
  tags: [],
  images: [],
  authorId: user.id,
  createdAt: user.createdAt,
}))

vi.mock('@/api/users', () => ({ fetchUsers: () => Promise.resolve(users) }))
vi.mock('@/api/skills', () => ({ fetchSkills: () => Promise.resolve(skills) }))
vi.mock('@/api/categories', () => ({ fetchCategories: () => Promise.resolve(categories) }))
vi.mock('@/api/cities', () => ({ fetchCities: () => Promise.resolve(cities) }))
vi.mock('@/widgets/Filters', () => ({ Filters: () => null }))

// IntersectionObserver в jsdom нет: подменяем и сами "долистываем" до маркера
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = []
  isConnected = false

  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.instances.push(this)
  }

  observe() {
    this.isConnected = true
  }

  disconnect() {
    this.isConnected = false
  }

  trigger() {
    this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as never)
  }

  static scrollToMarker() {
    FakeIntersectionObserver.instances
      .filter((observer) => observer.isConnected)
      .forEach((o) => o.trigger())
  }
}

const countRecommendedCards = () => {
  const section = screen.getByRole('heading', { name: 'Рекомендуем' }).closest('section')
  return within(section as HTMLElement).getAllByRole('article').length
}

describe('CatalogPage: подгрузка карточек при прокрутке', () => {
  beforeEach(() => {
    FakeIntersectionObserver.instances = []
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('показывает сначала 6 карточек, а после прокрутки и задержки их становится 12', async () => {
    render(<CatalogPage />)
    await screen.findByRole('heading', { name: 'Рекомендуем' })
    vi.useFakeTimers()

    expect(countRecommendedCards()).toBe(PAGE_SIZE)

    act(() => FakeIntersectionObserver.scrollToMarker())
    expect(screen.getByRole('status', { name: 'идет загрузка' })).toBeInTheDocument()
    expect(countRecommendedCards()).toBe(PAGE_SIZE)

    act(() => {
      vi.advanceTimersByTime(LOAD_DELAY_MS)
    })

    expect(countRecommendedCards()).toBe(PAGE_SIZE * 2)
    expect(screen.queryByRole('status', { name: 'идет загрузка' })).not.toBeInTheDocument()
  })
})
