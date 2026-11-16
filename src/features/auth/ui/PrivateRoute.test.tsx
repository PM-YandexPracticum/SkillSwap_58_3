import { cleanup, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { ROUTES } from '@/shared/lib/constants'
import authReducer from '../model/authSlice'
import { PrivateRoute } from './PrivateRoute'

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

describe('PrivateRoute', () => {
  it('перенаправляет гостя на страницу логина и передает from в state', () => {
    const store = createTestStore(false)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LocationTracker />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<div>Личный кабинет</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByTestId('location')).toHaveTextContent(ROUTES.LOGIN)
    expect(screen.getByTestId('from')).toHaveTextContent('/profile')
    expect(screen.queryByText('Личный кабинет')).not.toBeInTheDocument()
  })

  it('показывает защищенный контент авторизованному пользователю', () => {
    const store = createTestStore(true)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LocationTracker />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<div>Личный кабинет</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText('Личный кабинет')).toBeInTheDocument()
  })
})
