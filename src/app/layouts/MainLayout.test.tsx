import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ROUTES } from '@/shared/lib/constants'
import authReducer from '@/features/auth/model/authSlice'
import * as usersApi from '@/api/users'
import { MainLayout } from './MainLayout'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()

  globalThis.localStorage?.clear()
})

const createTestStore = (
  authUser: { id: string; name: string; email: string; token: string } | null = null,
) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: authUser,
        status: 'idle' as const,
        error: null,
        currentRequestId: null,
      },
    },
  })

const LocationTracker = () => {
  const location = useLocation()
  return <div data-testid="current-location">{location.pathname}</div>
}

describe('MainLayout', () => {
  it('рендерит кнопки входа и регистрации для гостя и выполняет переход', () => {
    const store = createTestStore(null)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<MainLayout searchValue="" onSearchChange={() => {}} />}>
              <Route path="/" element={<LocationTracker />} />
            </Route>
            <Route path={ROUTES.LOGIN} element={<div>Страница логина</div>} />
            <Route path={ROUTES.REGISTER} element={<div>Страница регистрации</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    const loginButton = screen.getByRole('button', { name: 'Войти' })
    const registerButton = screen.getByRole('button', { name: 'Зарегистрироваться' })

    expect(loginButton).toBeInTheDocument()
    expect(registerButton).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /профиль/i })).not.toBeInTheDocument()

    fireEvent.click(loginButton)
    expect(screen.getByText('Страница логина')).toBeInTheDocument()
  })

  it('при клике на регистрацию переходит на маршрут регистрации', () => {
    const store = createTestStore(null)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<MainLayout searchValue="" onSearchChange={() => {}} />}>
              <Route path="/" element={<LocationTracker />} />
            </Route>
            <Route path={ROUTES.REGISTER} element={<div>Страница регистрации</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    const registerButton = screen.getByRole('button', { name: 'Зарегистрироваться' })
    fireEvent.click(registerButton)
    expect(screen.getByText('Страница регистрации')).toBeInTheDocument()
  })

  it('отображает имя, аватар и элементы навигации для авторизованного пользователя', async () => {
    vi.spyOn(usersApi, 'fetchUserById').mockResolvedValueOnce({
      id: 'user-02',
      name: 'Мария',
      email: 'maria@example.com',
      avatarUrl: '/img/avatars/avatar-02.png',
      createdAt: '2026-05-28T17:00:00Z',
      password: 'pass',
      town: 'saint-petersburg',
      birthday: '1989-01-16',
      likedCount: 2,
      description: '',
      gender: 'female',
      learn: [],
      favourites: [],
    })

    const store = createTestStore({
      id: 'user-02',
      name: 'Мария',
      email: 'maria@example.com',
      token: 'mock-token',
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<MainLayout searchValue="" onSearchChange={() => {}} />}>
              <Route path="/" element={<LocationTracker />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText('Мария')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Уведомления' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Избранное' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /мария/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Войти' })).not.toBeInTheDocument()

    await waitFor(() => {
      const avatar = screen.getByRole('img', { name: 'Мария' })
      expect(avatar).toHaveAttribute('src', '/img/avatars/avatar-02.png')
    })
  })

  it('выходит из аккаунта при клике "Выйти из аккаунта", очищает стейт и переходит на главную', () => {
    const store = createTestStore({
      id: 'user-01',
      name: 'Иван',
      email: 'ivan@example.com',
      token: 'mock-token',
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/some-page']}>
          <Routes>
            <Route element={<MainLayout searchValue="" onSearchChange={() => {}} />}>
              <Route path="/some-page" element={<div>Тестовая страница</div>} />
              <Route path="/" element={<div>Главная страница</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    // Открываем меню профиля кликом по кнопке профиля
    const profileTrigger = screen.getByRole('button', { name: /иван/i })
    fireEvent.click(profileTrigger)

    const logoutButton = screen.getByRole('button', { name: 'Выйти из аккаунта' })
    fireEvent.click(logoutButton)

    // После логаута стейт должен очиститься, отобразиться главная и кнопки входа для гостя
    expect(store.getState().auth.user).toBeNull()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument()
  })
})
