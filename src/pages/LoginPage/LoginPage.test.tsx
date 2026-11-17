import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import authReducer, { type AuthState } from '@/features/auth/model/authSlice'
import * as usersApi from '@/api/users'
import LoginPage from './index'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.resetAllMocks()
})

describe('LoginPage', () => {
  it('ошибка по полем пароля появляется, email сохраняется', async () => {
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue([
      {
        id: 'user-01',
        name: 'Иван Петров',
        email: 'ivan.petrov@example.com',
        avatarUrl: '/img/avatars/avatar-01.png',
        createdAt: '2025-04-24T18:15:00Z',
        password: 'Skill01Swap!',
        town: 'moscow',
        birthday: '1993-01-07',
        likedCount: 12,
        description: 'Практик, а не теоретик: покажу на примерах, как это работает.',
        gender: 'male',
        learn: ['home-houseplants', 'home-finances'],
        favourites: ['user-02', 'user-23', 'user-28', 'user-29', 'user-33'],
      },
    ])

    const store = configureStore({
      reducer: { auth: authReducer },
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    const emailInput = screen.getByPlaceholderText('Введите email')
    const passwordInput = screen.getByPlaceholderText('Введите пароль')
    const submitButton = screen.getByRole('button', { name: 'Войти' })

    await userEvent.type(emailInput, 'ivan.petrov@example.com')
    await userEvent.type(passwordInput, 'Skill01Swap!!!')
    await userEvent.click(submitButton)

    expect(await screen.findByText('Неверная почта или пароль')).toBeVisible()
    expect(emailInput).toHaveValue('ivan.petrov@example.com')
  })

  it('после корректного входа пользователя возвращает на главную', async () => {
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue([
      {
        id: 'user-01',
        name: 'Иван Петров',
        email: 'ivan.petrov@example.com',
        avatarUrl: '/img/avatars/avatar-01.png',
        createdAt: '2025-04-24T18:15:00Z',
        password: 'Skill01Swap!',
        town: 'moscow',
        birthday: '1993-01-07',
        likedCount: 12,
        description: 'Практик, а не теоретик: покажу на примерах, как это работает.',
        gender: 'male',
        learn: ['home-houseplants', 'home-finances'],
        favourites: ['user-02', 'user-23', 'user-28', 'user-29', 'user-33'],
      },
    ])

    const store = configureStore({
      reducer: { auth: authReducer },
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>Главная</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    const emailInput = screen.getByPlaceholderText('Введите email')
    const passwordInput = screen.getByPlaceholderText('Введите пароль')
    const submitButton = screen.getByRole('button', { name: 'Войти' })

    await userEvent.type(emailInput, 'ivan.petrov@example.com')
    await userEvent.type(passwordInput, 'Skill01Swap!')
    await userEvent.click(submitButton)

    expect(await screen.findByText('Главная')).toBeVisible()
  })

  it('после корректного входа пользователя возвращает на предыдущую страницу', async () => {
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue([
      {
        id: 'user-01',
        name: 'Иван Петров',
        email: 'ivan.petrov@example.com',
        avatarUrl: '/img/avatars/avatar-01.png',
        createdAt: '2025-04-24T18:15:00Z',
        password: 'Skill01Swap!',
        town: 'moscow',
        birthday: '1993-01-07',
        likedCount: 12,
        description: 'Практик, а не теоретик: покажу на примерах, как это работает.',
        gender: 'male',
        learn: ['home-houseplants', 'home-finances'],
        favourites: ['user-02', 'user-23', 'user-28', 'user-29', 'user-33'],
      },
    ])

    const store = configureStore({
      reducer: { auth: authReducer },
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/login', state: { from: '/profile' } }]}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>Главная</div>} />
            <Route path="/profile" element={<div>Профиль</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    const emailInput = screen.getByPlaceholderText('Введите email')
    const passwordInput = screen.getByPlaceholderText('Введите пароль')
    const submitButton = screen.getByRole('button', { name: 'Войти' })

    await userEvent.type(emailInput, 'ivan.petrov@example.com')
    await userEvent.type(passwordInput, 'Skill01Swap!')
    await userEvent.click(submitButton)

    expect(await screen.findByText('Профиль')).toBeVisible()
  })

  it('после нажатия кнопки `Закрыть` пользователя возвращает на главную', async () => {
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue([])

    const store = configureStore({
      reducer: { auth: authReducer },
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>Главная</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    const closeButton = screen.getByRole('button', { name: 'Закрыть' })

    await userEvent.click(closeButton)

    expect(await screen.findByText('Главная')).toBeVisible()
  })

  it('авторизованного пользователя возвращает на главную при попытке зайти', async () => {
    const preloadedAuthState: AuthState = {
      user: {
        id: 'user-01',
        name: 'Иван Петров',
        email: 'ivan.petrov@example.com',
        token: 'mock-token',
      },
      status: 'idle',
      error: null,
      currentRequestId: null,
    }

    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: preloadedAuthState,
      },
    })
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>Главная</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    expect(await screen.findByText('Главная')).toBeVisible()
  })
})
