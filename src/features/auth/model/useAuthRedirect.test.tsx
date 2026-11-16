import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { ROUTES } from '@/shared/lib/constants'
import { useAuthRedirect } from './useAuthRedirect'

afterEach(cleanup)

const TestRedirectComponent = () => {
  const redirectBack = useAuthRedirect()
  return (
    <button type="button" onClick={() => redirectBack()}>
      Вернуться
    </button>
  )
}

const LocationTracker = () => {
  const location = useLocation()
  return <span data-testid="location">{location.pathname}</span>
}

describe('useAuthRedirect', () => {
  it('перенаправляет на адрес из state.from', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={[{ pathname: ROUTES.LOGIN, state: { from: '/profile' } }]}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<TestRedirectComponent />} />
          <Route path="/profile" element={<LocationTracker />} />
          <Route path={ROUTES.HOME} element={<LocationTracker />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Вернуться' }))
    expect(screen.getByTestId('location')).toHaveTextContent('/profile')
  })

  it('перенаправляет на главную, если state.from отсутствует', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<TestRedirectComponent />} />
          <Route path={ROUTES.HOME} element={<LocationTracker />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Вернуться' }))
    expect(screen.getByTestId('location')).toHaveTextContent(ROUTES.HOME)
  })
})
