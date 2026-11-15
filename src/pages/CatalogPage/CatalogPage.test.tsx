import { configureStore } from '@reduxjs/toolkit'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCategories } from '@/api/categories'
import { fetchCities } from '@/api/cities'
import { fetchSkills } from '@/api/skills'
import { fetchUsers } from '@/api/users'
import type { Skill, User } from '@/shared/types'
import filtersReducer, {
  selectFilters,
  selectSearch,
  setFilters,
  setSearch,
} from '@/store/slices/filtersSlice'
import { DEFAULT_FILTERS } from '@/widgets/Filters/constants'
import type { FiltersValues } from '@/widgets/Filters/interface'
import categories from '../../../public/db/categories.json'
import cities from '../../../public/db/cities.json'
import skillsFixture from '../../../public/db/skills.json'
import usersFixture from '../../../public/db/users.json'
import CatalogPage from './index'

vi.mock('@/api/categories', () => ({ fetchCategories: vi.fn() }))
vi.mock('@/api/cities', () => ({ fetchCities: vi.fn() }))
vi.mock('@/api/skills', () => ({ fetchSkills: vi.fn() }))
vi.mock('@/api/users', () => ({ fetchUsers: vi.fn() }))

function renderPage({ search = '', values }: { search?: string; values?: FiltersValues } = {}) {
  const store = configureStore({ reducer: { filters: filtersReducer } })
  store.dispatch(setSearch(search))
  if (values) store.dispatch(setFilters(values))
  render(
    <Provider store={store}>
      <CatalogPage />
    </Provider>,
  )
  return store
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(fetchUsers).mockResolvedValue(usersFixture as unknown as User[])
  vi.mocked(fetchSkills).mockResolvedValue(skillsFixture as Skill[])
  vi.mocked(fetchCategories).mockResolvedValue(categories)
  vi.mocked(fetchCities).mockResolvedValue(cities)
})

afterEach(cleanup)

describe('CatalogPage: фильтры и чипы', () => {
  it('показывает три исходные секции и значения фильтров по умолчанию', async () => {
    const store = renderPage()

    expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Новое' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Рекомендуем' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Всё' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Не имеет значения' })).toBeChecked()
    expect(screen.queryByRole('list', { name: 'Активные фильтры' })).not.toBeInTheDocument()
    expect(selectFilters(store.getState())).toEqual(DEFAULT_FILTERS)
  })

  it('связывает выбор пола и города с Redux и удаляет их через чипы', async () => {
    const user = userEvent.setup()
    const store = renderPage({ search: 'барабаны' })
    const cityCheckbox = await screen.findByRole('checkbox', { name: 'Москва' })

    await user.click(screen.getByRole('radio', { name: 'Женский' }))
    await user.click(cityCheckbox)

    expect(selectFilters(store.getState())).toEqual({
      ...DEFAULT_FILTERS,
      gender: 'female',
      cityIds: ['moscow'],
    })
    const chips = screen.getByRole('list', { name: 'Активные фильтры' })
    expect(within(chips).getByRole('listitem', { name: 'Женский' })).toBeInTheDocument()
    const cityChip = within(chips).getByRole('listitem', { name: 'Москва' })

    await user.click(within(cityChip).getByRole('button', { name: 'Удалить' }))

    expect(cityCheckbox).not.toBeChecked()
    expect(selectFilters(store.getState())).toEqual({ ...DEFAULT_FILTERS, gender: 'female' })
    expect(within(chips).queryByRole('listitem', { name: 'Москва' })).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Женский' })).toBeChecked()

    const genderChip = within(chips).getByRole('listitem', { name: 'Женский' })
    await user.click(within(genderChip).getByRole('button', { name: 'Удалить' }))

    expect(screen.getByRole('radio', { name: 'Не имеет значения' })).toBeChecked()
    expect(selectFilters(store.getState())).toEqual(DEFAULT_FILTERS)
    expect(selectSearch(store.getState())).toBe('барабаны')
    expect(screen.queryByRole('list', { name: 'Активные фильтры' })).not.toBeInTheDocument()
  })

  it('явный сброс очищает поиск, все фильтры и чипы', async () => {
    const user = userEvent.setup()
    const store = renderPage({
      search: 'барабаны',
      values: {
        purpose: 'teach',
        gender: 'male',
        categoryIds: ['creativity'],
        subcategoryIds: ['creativity-music-and-sound'],
        cityIds: ['moscow'],
      },
    })
    expect(await screen.findByRole('checkbox', { name: 'Москва' })).toBeChecked()
    expect(screen.getByRole('list', { name: 'Активные фильтры' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(selectSearch(store.getState())).toBe('')
    expect(selectFilters(store.getState())).toEqual(DEFAULT_FILTERS)
    expect(screen.getByRole('radio', { name: 'Всё' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Не имеет значения' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Москва' })).not.toBeChecked()
    expect(
      screen.getByRole('checkbox', { name: 'Творчество и искусство' }),
    ).not.toBePartiallyChecked()
    expect(screen.queryByRole('list', { name: 'Активные фильтры' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Сбросить' })).not.toBeInTheDocument()
  })
})
