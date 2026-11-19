import { configureStore } from '@reduxjs/toolkit'
import { act, cleanup, render, screen, within } from '@testing-library/react'
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
import catalogReducer from '@/store/slices/catalogSlice'
import { DEFAULT_FILTERS } from '@/widgets/Filters/constants'
import type { FiltersValues } from '@/widgets/Filters/interface'
import { MemoryRouter } from 'react-router-dom'
import authReducer from '@/features/auth/model/authSlice'
import favoritesReducer from '@/features/favorites/model/favoritesSlice'
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
  const store = configureStore({
    reducer: {
      auth: authReducer,
      favorites: favoritesReducer,
      filters: filtersReducer,
      catalog: catalogReducer,
    },
  })

  store.dispatch(setSearch(search))
  if (values) store.dispatch(setFilters(values))

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    </Provider>,
  )

  return store
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
  vi.mocked(fetchUsers).mockResolvedValue(usersFixture as unknown as User[])
  vi.mocked(fetchSkills).mockResolvedValue(skillsFixture as Skill[])
  vi.mocked(fetchCategories).mockResolvedValue(categories)
  vi.mocked(fetchCities).mockResolvedValue(cities)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

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
    const store = renderPage({ search: 'барабан' })
    const cityCheckbox = await screen.findByRole('checkbox', { name: 'Москва' })

    await user.click(screen.getByRole('radio', { name: 'Женский' }))
    await user.click(cityCheckbox)

    expect(selectFilters(store.getState())).toEqual({
      ...DEFAULT_FILTERS,
      gender: 'female',
      cityIds: ['moscow'],
    })
    expect(screen.getByRole('heading', { name: 'Подходящие предложения: 0' })).toBeInTheDocument()
    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
    const chips = screen.getByRole('list', { name: 'Активные фильтры' })
    expect(within(chips).getByRole('listitem', { name: 'Женский' })).toBeInTheDocument()
    const cityChip = within(chips).getByRole('listitem', { name: 'Москва' })

    await user.click(within(cityChip).getByRole('button', { name: 'Удалить' }))

    expect(cityCheckbox).not.toBeChecked()
    expect(selectFilters(store.getState())).toEqual({ ...DEFAULT_FILTERS, gender: 'female' })
    expect(within(chips).queryByRole('listitem', { name: 'Москва' })).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Женский' })).toBeChecked()
    expect(screen.getByRole('heading', { name: 'Подходящие предложения: 1' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Валерия Лазарева' })).toBeInTheDocument()

    const genderChip = within(chips).getByRole('listitem', { name: 'Женский' })
    await user.click(within(genderChip).getByRole('button', { name: 'Удалить' }))

    expect(screen.getByRole('radio', { name: 'Не имеет значения' })).toBeChecked()
    expect(selectFilters(store.getState())).toEqual(DEFAULT_FILTERS)
    expect(selectSearch(store.getState())).toBe('барабан')
    expect(screen.queryByRole('list', { name: 'Активные фильтры' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Подходящие предложения: 2' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.queryByRole('heading', { name: 'Популярное' })).not.toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Новое' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Рекомендуем' })).toBeInTheDocument()
    expect(screen.queryByText('Ничего не найдено')).not.toBeInTheDocument()
  })

  it('меняет выдачу при изменении поиска и считает автора нескольких совпавших навыков один раз', async () => {
    vi.mocked(fetchSkills).mockResolvedValue([
      ...(skillsFixture as Skill[]),
      {
        ...skillsFixture[0],
        id: 'second-photography',
        title: 'Фотография при дневном свете',
      } as Skill,
    ])
    const store = renderPage()
    await screen.findByRole('heading', { name: 'Популярное' })

    act(() => store.dispatch(setSearch('  ФОТОГРАФИЯ  ')))

    expect(screen.getByRole('heading', { name: 'Подходящие предложения: 1' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('article', { name: 'Иван Петров' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Популярное' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Новое' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Рекомендуем' })).not.toBeInTheDocument()

    act(() => store.dispatch(setSearch('английский')))

    expect(screen.getByRole('heading', { name: 'Подходящие предложения: 2' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Татьяна Зайцева' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Алёна Щербакова' })).toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Иван Петров' })).not.toBeInTheDocument()

    act(() => store.dispatch(setSearch('')))

    expect(screen.getByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Новое' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Рекомендуем' })).toBeInTheDocument()
    expect(fetchUsers).toHaveBeenCalledTimes(1)
    expect(fetchSkills).toHaveBeenCalledTimes(1)
  })

  it('сохраняет три исходные секции при поиске из пробелов', async () => {
    renderPage({ search: '   ' })

    expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Новое' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Рекомендуем' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Подходящие предложения:/ }),
    ).not.toBeInTheDocument()
  })

  it('показывает всю единую выдачу без лимитов исходных секций при выборе цели', async () => {
    renderPage({ values: { ...DEFAULT_FILTERS, purpose: 'learn' } })

    expect(
      await screen.findByRole('heading', { name: 'Подходящие предложения: 40' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(40)
    expect(screen.queryByRole('heading', { name: 'Популярное' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Смотреть все' })).not.toBeInTheDocument()
  })

  it('возвращает три секции после удаления последней плашки при пустом поиске', async () => {
    const user = userEvent.setup()
    renderPage({ values: { ...DEFAULT_FILTERS, cityIds: ['moscow'] } })
    await screen.findByRole('heading', { name: 'Подходящие предложения: 5' })
    const chip = within(screen.getByRole('list', { name: 'Активные фильтры' })).getByRole(
      'listitem',
      {
        name: 'Москва',
      },
    )

    await user.click(within(chip).getByRole('button', { name: 'Удалить' }))

    expect(screen.getByRole('heading', { name: 'Популярное' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Новое' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Рекомендуем' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Москва' })).not.toBeChecked()
    expect(
      screen.queryByRole('heading', { name: /Подходящие предложения:/ }),
    ).not.toBeInTheDocument()
  })

  it('показывает нулевой счётчик и пустое состояние без карточек при отсутствии совпадений', async () => {
    renderPage({ search: 'навык-которого-нет' })

    expect(
      await screen.findByRole('heading', { name: 'Подходящие предложения: 0' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Популярное' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Новое' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Рекомендуем' })).not.toBeInTheDocument()
  })
})
