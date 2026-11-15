import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ROUTES } from '@/shared/lib/constants'
import authReducer from './authSlice'
import { useRequireAuth } from './useRequireAuth'

afterEach(cleanup)

const createTestStore = (isAuthorized: boolean) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: isAuthorized
          ? { id: '1', name: 'Иван', email: 'test@mail.ru', token: 'token' }
          : null,
        status: 'idle' as const,
        error: null,
        currentRequestId: null,
      },
    },
  })

const TestComponent = ({ onAction }: { onAction: () => void }) => {
  const requireAuth = useRequireAuth()
  return (
    <button type="button" onClick={() => requireAuth(onAction)}>
      Выполнить действие
    </button>
  )
}

const LocationTracker = () => {
  const location = useLocation()
  return (
    <div>
      <span data-testid="location">{location.pathname}</span>
      <span data-testid="from">
        {(location.state as { from?: { pathname: string } })?.from?.pathname}
      </span>
    </div>
  )
}

describe('useRequireAuth', () => {
  it('вызывает действие, если пользователь авторизован', async () => {
    const user = userEvent.setup()
    const store = createTestStore(true)
    const action = vi.fn()

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <TestComponent onAction={action} />
        </MemoryRouter>
      </Provider>,
    )

    await user.click(screen.getByRole('button', { name: 'Выполнить действие' }))
    expect(action).toHaveBeenCalledTimes(1)
  })

  it('перенаправляет гостя на логин с адресом from и не вызывает действие', async () => {
    const user = userEvent.setup()
    const store = createTestStore(false)
    const action = vi.fn()

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/catalog']}>
          <Routes>
            <Route path="/catalog" element={<TestComponent onAction={action} />} />
            <Route path={ROUTES.LOGIN} element={<LocationTracker />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    await user.click(screen.getByRole('button', { name: 'Выполнить действие' }))
    expect(action).not.toHaveBeenCalled()
    expect(screen.getByTestId('location')).toHaveTextContent(ROUTES.LOGIN)
    expect(screen.getByTestId('from')).toHaveTextContent('/catalog')
  })
})
