import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NotificationPanel } from './NotificationPanel'
import type { NotificationItem } from '@/shared/types'

afterEach(cleanup)

const mockNewItems: NotificationItem[] = [
  {
    id: 'notif-1',
    text: 'Иван предлагает вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    dateLabel: '17 ноября',
  },
]

const mockViewedItems: NotificationItem[] = [
  {
    id: 'notif-2',
    text: 'Анна предлагает вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    dateLabel: '15 ноября',
  },
]

describe('NotificationPanel', () => {
  it('отображает пустые секции, когда уведомлений нет', () => {
    render(
      <NotificationPanel
        newItems={[]}
        viewedItems={[]}
        onGo={vi.fn()}
        onReadAll={vi.fn()}
        onClear={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Новые уведомления' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Просмотренные' })).toBeInTheDocument()
    expect(screen.getAllByText('Нет уведомлений')).toHaveLength(2)
    expect(screen.queryByRole('button', { name: 'Прочитать все' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Очистить' })).not.toBeInTheDocument()
  })

  it('отображает новые уведомления и вызывает onReadAll по клику на «Прочитать все»', async () => {
    const user = userEvent.setup()
    const handleReadAll = vi.fn()

    render(
      <NotificationPanel
        newItems={mockNewItems}
        viewedItems={[]}
        onGo={vi.fn()}
        onReadAll={handleReadAll}
        onClear={vi.fn()}
      />,
    )

    expect(screen.getByText('Иван предлагает вам обмен')).toBeInTheDocument()
    expect(screen.getByText('Примите обмен, чтобы обсудить детали')).toBeInTheDocument()
    expect(screen.getByText('17 ноября')).toBeInTheDocument()

    const readAllButton = screen.getByRole('button', { name: 'Прочитать все' })
    await user.click(readAllButton)
    expect(handleReadAll).toHaveBeenCalledTimes(1)
  })

  it('вызывает onGo с идентификатором уведомления при клике на кнопку «Перейти»', async () => {
    const user = userEvent.setup()
    const handleGo = vi.fn()

    render(
      <NotificationPanel
        newItems={mockNewItems}
        viewedItems={[]}
        onGo={handleGo}
        onReadAll={vi.fn()}
        onClear={vi.fn()}
      />,
    )

    const goButton = screen.getByRole('button', {
      name: 'перейти к Уведомлению: Иван предлагает вам обмен',
    })
    await user.click(goButton)
    expect(handleGo).toHaveBeenCalledWith('notif-1')
  })

  it('отображает просмотренные уведомления и вызывает onClear по клику на «Очистить»', async () => {
    const user = userEvent.setup()
    const handleClear = vi.fn()

    render(
      <NotificationPanel
        newItems={[]}
        viewedItems={mockViewedItems}
        onGo={vi.fn()}
        onReadAll={vi.fn()}
        onClear={handleClear}
      />,
    )

    expect(screen.getByText('Анна предлагает вам обмен')).toBeInTheDocument()
    expect(screen.getByText('15 ноября')).toBeInTheDocument()

    const clearButton = screen.getByRole('button', { name: 'Очистить' })
    await user.click(clearButton)
    expect(handleClear).toHaveBeenCalledTimes(1)
  })
})
