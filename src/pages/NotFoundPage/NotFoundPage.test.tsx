import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import NotFoundPage from './NotFoundPage'

const NOT_FOUND_PATH = '/some/missing/page'

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={[NOT_FOUND_PATH]}>
      <Routes>
        <Route path={ROUTES.HOME} element={<p>Главная страница</p>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe('NotFoundPage', () => {
  it('показывает заголовок и описание ошибки', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
    expect(screen.getByText(/эта страница недоступна/)).toBeInTheDocument()
  })

  it('показывает картинку с подписью про ошибку 404', () => {
    renderPage()

    expect(screen.getByRole('img', { name: /404/ })).toBeInTheDocument()
  })

  it('показывает две кнопки', () => {
    renderPage()

    expect(screen.getByRole('button', { name: 'Сообщить об ошибке' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'На главную' })).toBeInTheDocument()
  })

  it('ведёт на главную по кнопке «На главную»', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: 'На главную' }))

    expect(screen.getByText('Главная страница')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Страница не найдена' })).not.toBeInTheDocument()
  })

  it('кнопка «Сообщить об ошибке» ничего не делает', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: 'Сообщить об ошибке' }))

    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
    expect(screen.queryByText('Главная страница')).not.toBeInTheDocument()
  })
})
