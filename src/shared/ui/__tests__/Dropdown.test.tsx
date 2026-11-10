import { useState } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Dropdown } from '../Dropdown'

afterEach(cleanup)

function Example({
  initiallyOpen = true,
  onClose,
}: {
  initiallyOpen?: boolean
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(initiallyOpen)

  return (
    <>
      <Dropdown
        trigger={
          <button type="button" onClick={() => setIsOpen((open) => !open)}>
            Открыть панель
          </button>
        }
        isOpen={isOpen}
        onClose={() => {
          onClose()
          setIsOpen(false)
        }}
        ariaLabel="Содержимое панели"
      >
        <p>Подробности уведомления</p>
        <button type="button">Действие внутри</button>
      </Dropdown>
      <button type="button">Снаружи</button>
    </>
  )
}

describe('Dropdown', () => {
  it('управляется родителем и связывает кнопку с панелью для экранного диктора', () => {
    const onClose = vi.fn()
    const props = {
      trigger: <button type="button">Открыть панель</button>,
      onClose,
      ariaLabel: 'Содержимое панели',
      children: <p>Текст панели</p>,
    }
    const { rerender } = render(<Dropdown {...props} isOpen={false} />)
    const trigger = screen.getByRole('button', { name: 'Открыть панель' })
    const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '')

    expect(panel).toBeInTheDocument()
    expect(panel).not.toBeVisible()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.pointerDown(document.body)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()

    rerender(<Dropdown {...props} isOpen />)
    expect(screen.getByRole('group', { name: 'Содержимое панели' })).toBe(panel)
    expect(panel).toBeVisible()
    expect(panel).toHaveTextContent('Текст панели')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('сохраняет обработчик trigger и не закрывает панель при клике внутри', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Example initiallyOpen={false} onClose={onClose} />)
    const trigger = screen.getByRole('button', { name: 'Открыть панель' })

    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Действие внутри' }))
    expect(screen.getByRole('group')).toBeVisible()
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('не закрывается при переходе с trigger на обычный текст внутри панели', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Example initiallyOpen={false} onClose={onClose} />)
    const trigger = screen.getByRole('button', { name: 'Открыть панель' })

    await user.click(trigger)
    expect(trigger).toHaveFocus()
    await user.click(screen.getByText('Подробности уведомления'))

    expect(screen.getByRole('group', { name: 'Содержимое панели' })).toBeVisible()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('закрывается при pointerdown вне панели', () => {
    const onClose = vi.fn()
    render(<Example onClose={onClose} />)

    fireEvent.pointerDown(document.body)

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })

  it('по Escape закрывается и возвращает фокус на trigger', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Example onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Действие внутри' }))

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Открыть панель' })).toHaveFocus()
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('не удерживает фокус при Tab за пределы панели', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Example onClose={onClose} />)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Открыть панель' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Действие внутри' })).toHaveFocus()
    expect(onClose).not.toHaveBeenCalled()
    await user.tab()

    expect(screen.getByRole('button', { name: 'Снаружи' })).toHaveFocus()
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })

  it('не перехватывает фокус при клике снаружи и не блокирует скролл', async () => {
    const user = userEvent.setup()
    const overflow = document.body.style.overflow
    const onClose = vi.fn()
    render(<Example onClose={onClose} />)
    expect(document.body.style.overflow).toBe(overflow)
    await user.click(screen.getByRole('button', { name: 'Действие внутри' }))

    await user.click(screen.getByRole('button', { name: 'Снаружи' }))

    expect(screen.getByRole('button', { name: 'Снаружи' })).toHaveFocus()
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(document.body.style.overflow).toBe(overflow)
  })

  it('удаляет обработчики после размонтирования', () => {
    const onClose = vi.fn()
    const { unmount } = render(<Example onClose={onClose} />)
    unmount()

    fireEvent.pointerDown(document.body)
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).not.toHaveBeenCalled()
  })
})
