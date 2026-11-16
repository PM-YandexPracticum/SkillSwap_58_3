import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Header } from './Header'

afterEach(cleanup)

describe('Header', () => {
  it('отображает кнопки входа и регистрации для гостя и вызывает колбэки', () => {
    const handleLogin = vi.fn()
    const handleRegister = vi.fn()

    render(
      <MemoryRouter>
        <Header
          isAuthorized={false}
          searchValue=""
          onSearchChange={() => {}}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </MemoryRouter>,
    )

    const loginBtn = screen.getByRole('button', { name: 'Войти' })
    const registerBtn = screen.getByRole('button', { name: 'Зарегистрироваться' })

    expect(loginBtn).toBeInTheDocument()
    expect(registerBtn).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /профиль/i })).not.toBeInTheDocument()

    fireEvent.click(loginBtn)
    expect(handleLogin).toHaveBeenCalledTimes(1)

    fireEvent.click(registerBtn)
    expect(handleRegister).toHaveBeenCalledTimes(1)
  })

  it('отображает имя, аватар, уведомления и избранное для авторизованного пользователя', () => {
    const handleLogout = vi.fn()

    render(
      <MemoryRouter>
        <Header
          isAuthorized={true}
          name="Мария"
          avatarUrl="/img/avatars/avatar-02.png"
          searchValue=""
          onSearchChange={() => {}}
          onLogout={handleLogout}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Мария')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Мария' })).toHaveAttribute(
      'src',
      '/img/avatars/avatar-02.png',
    )
    expect(screen.getByRole('button', { name: 'Уведомления' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Избранное' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Войти' })).not.toBeInTheDocument()

    // Кликаем по кнопке профиля и проверяем логаут
    const profileTrigger = screen.getByRole('button', { name: /мария/i })
    fireEvent.click(profileTrigger)

    const logoutBtn = screen.getByRole('button', { name: 'Выйти из аккаунта' })
    expect(logoutBtn).toBeInTheDocument()

    fireEvent.click(logoutBtn)
    expect(handleLogout).toHaveBeenCalledTimes(1)
  })
})
