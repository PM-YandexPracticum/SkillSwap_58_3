import { configureStore } from '@reduxjs/toolkit'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCategories } from '@/api/categories'
import { ROUTES } from '@/shared/lib/constants'
import filtersReducer, { selectFilters, setSearch } from '@/store/slices/filtersSlice'
import categories from '../../../public/db/categories.json'
import { SkillsMenu } from './SkillsMenu'

vi.mock('@/api/categories', () => ({ fetchCategories: vi.fn() }))

const SKILLS_PATH = '/skills'
const firstCategory = categories[0]
const firstSubcategory = firstCategory.subcategories[0]

const LocationTracker = () => <p data-testid="location">{useLocation().pathname}</p>

function renderMenu(onSelect?: () => void) {
  const store = configureStore({ reducer: { filters: filtersReducer } })
  store.dispatch(setSearch('гитара'))

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[SKILLS_PATH]}>
        <Routes>
          <Route path={SKILLS_PATH} element={<SkillsMenu onSelect={onSelect} />} />
          <Route path={ROUTES.HOME} element={<LocationTracker />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

  return store
}

beforeEach(() => {
  vi.mocked(fetchCategories).mockResolvedValue(categories)
})

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

describe('SkillsMenu', () => {
  it('показывает все категории и подкатегории', async () => {
    renderMenu()

    expect(await screen.findByRole('heading', { name: firstCategory.name })).toBeInTheDocument()
    categories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        expect(screen.getByRole('button', { name: subcategory.name })).toBeInTheDocument()
      })
    })
  })

  it('клик по подкатегории включает фильтр, ведёт на главную и вызывает onSelect', async () => {
    const onSelect = vi.fn()
    const store = renderMenu(onSelect)

    await userEvent.click(await screen.findByRole('button', { name: firstSubcategory.name }))

    expect(selectFilters(store.getState()).subcategoryIds).toEqual([firstSubcategory.id])
    expect(store.getState().filters.search).toBe('')
    expect(screen.getByTestId('location')).toHaveTextContent(ROUTES.HOME)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('показывает ошибку, если категории не загрузились', async () => {
    vi.mocked(fetchCategories).mockRejectedValue(new Error('network'))
    renderMenu()

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить навыки')
  })
})
