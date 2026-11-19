import { configureStore } from '@reduxjs/toolkit'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCategories } from '@/api/categories'
import { ROUTES } from '@/shared/lib/constants'
import filtersReducer, { selectFilters } from '@/store/slices/filtersSlice'
import categories from '../../../public/db/categories.json'
import SkillsPage from './index'

vi.mock('@/api/categories', () => ({ fetchCategories: vi.fn() }))

const subcategory = categories[1].subcategories[0]

const LocationTracker = () => <p data-testid="location">{useLocation().pathname}</p>

beforeEach(() => {
  vi.mocked(fetchCategories).mockResolvedValue(categories)
})

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

describe('SkillsPage', () => {
  it('показывает страницу со всеми категориями и подкатегориями', async () => {
    const store = configureStore({ reducer: { filters: filtersReducer } })
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ROUTES.SKILLS]}>
          <SkillsPage />
        </MemoryRouter>
      </Provider>,
    )

    expect(await screen.findByRole('heading', { name: categories[0].name })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: subcategory.name })).toBeInTheDocument()
  })

  it('клик по подкатегории фильтрует карточки и переводит на главную', async () => {
    const store = configureStore({ reducer: { filters: filtersReducer } })
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ROUTES.SKILLS]}>
          <Routes>
            <Route path={ROUTES.SKILLS} element={<SkillsPage />} />
            <Route path={ROUTES.HOME} element={<LocationTracker />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    await userEvent.click(await screen.findByRole('button', { name: subcategory.name }))

    expect(selectFilters(store.getState()).subcategoryIds).toEqual([subcategory.id])
    expect(screen.getByTestId('location')).toHaveTextContent(ROUTES.HOME)
  })
})
