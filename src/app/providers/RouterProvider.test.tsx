import { configureStore } from '@reduxjs/toolkit'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import filtersReducer, { selectSearch, setSearch } from '@/store/slices/filtersSlice'
import { AppRouter } from './RouterProvider'

vi.mock('@/pages/CatalogPage', () => ({
  default: () => <p>Каталог для проверки поиска</p>,
}))

beforeEach(() => {
  window.history.replaceState({}, '', '/')
})

afterEach(cleanup)

describe('AppRouter: поиск в Header', () => {
  it('связывает ввод, внешнее изменение store и очистку поисковой строки', async () => {
    const user = userEvent.setup()
    const store = configureStore({ reducer: { filters: filtersReducer } })
    render(
      <Provider store={store}>
        <AppRouter />
      </Provider>,
    )
    await screen.findByText('Каталог для проверки поиска')
    const input = screen.getByPlaceholderText('Искать навык')

    await user.type(input, 'Барабаны')

    expect(input).toHaveValue('Барабаны')
    expect(selectSearch(store.getState())).toBe('Барабаны')

    act(() => {
      store.dispatch(setSearch('Фотография'))
    })

    expect(input).toHaveValue('Фотография')

    await user.click(screen.getByRole('button', { name: 'Правая иконка' }))

    expect(input).toHaveValue('')
    expect(selectSearch(store.getState())).toBe('')
  })
})
