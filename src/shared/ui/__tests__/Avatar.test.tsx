import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Avatar } from '../Avatar'

afterEach(cleanup)

describe('Avatar с Dropdown', () => {
  it.each([
    ['Изменить', 'edit'],
    ['Удалить', 'delete'],
  ])('передаёт действие «%s», закрывает меню и возвращает фокус', async (label, action) => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<Avatar src="/img/avatars/avatar-01.png" onEdit={onEdit} />)
    const trigger = screen.getByRole('button', { name: 'Редактировать фото' })

    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: label }))

    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onEdit).toHaveBeenCalledWith(action)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })
})
