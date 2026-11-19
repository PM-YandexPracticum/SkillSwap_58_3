import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Skill } from '@/shared/types'
import { SkillCard } from './SkillCard'
import type { SkillCardProps } from './interface'

afterEach(cleanup)

const skill: Skill = {
  id: 'skill-1',
  title: 'Игра на барабанах',
  description: 'Научу держать ритм и играть любимые песни.',
  type: 'teach',
  category: 'creativity',
  subcategory: 'music',
  tags: [],
  images: ['/img/skills/skill-01.png'],
  authorId: 'user-1',
  createdAt: '2026-11-01T12:00:00Z',
}

const baseProps: Omit<SkillCardProps, 'onAction'> = {
  skill,
  author: { id: 'user-1', name: 'Мария' },
  categoryName: 'Творчество и искусство',
  subcategoryName: 'Музыка',
}

describe('SkillCard', () => {
  it('показывает данные навыка и доступные названия действий', () => {
    render(<SkillCard {...baseProps} onAction={vi.fn()} />)

    expect(screen.getByRole('heading', { name: skill.title })).toBeInTheDocument()
    expect(screen.getByText(skill.description)).toBeInTheDocument()
    expect(screen.getByText('Творчество и искусство / Музыка')).toBeInTheDocument()
    expect(screen.getByRole('article')).toHaveAccessibleName(`${skill.title}. Автор: Мария`)
    expect(
      screen.getByRole('img', { name: `${skill.title}. Автор: Мария. Фото 1` }),
    ).toHaveAttribute('src', skill.images[0])
    expect(screen.getByRole('button', { name: 'Поделиться навыком' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Дополнительные действия' })).toBeDisabled()
  })

  it('предлагает обмен один раз и блокирует повторную заявку', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<SkillCard {...baseProps} onAction={onAction} />)

    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
    const pendingButton = screen.getByRole('button', { name: 'Обмен предложен' })

    expect(pendingButton).toBeDisabled()
    expect(pendingButton.querySelector('use')).toHaveAttribute('href', '/icons/sprite.svg#clock')
    await user.click(pendingButton)
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onAction).toHaveBeenCalledWith('exchange')
  })

  it('отдаёт родителю управление обменом после локальной заявки', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const { rerender } = render(<SkillCard {...baseProps} onAction={onAction} />)

    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))
    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
    rerender(<SkillCard {...baseProps} isExchanged onAction={onAction} />)
    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()

    rerender(<SkillCard {...baseProps} isExchanged={false} onAction={onAction} />)
    const exchangeButton = screen.getByRole('button', { name: 'Предложить обмен' })
    expect(exchangeButton).toBeEnabled()
    await user.click(exchangeButton)

    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()
    expect(onAction.mock.calls).toEqual([['exchange'], ['exchange']])
    rerender(<SkillCard {...baseProps} isExchanged onAction={onAction} />)
    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
  })

  it('сообщает о лайке, а его состояние получает от родителя', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const { rerender } = render(<SkillCard {...baseProps} onAction={onAction} />)

    await user.click(screen.getByRole('button', { name: 'поставить лайк. Лайков: 0' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onAction).toHaveBeenCalledWith('like')
    expect(screen.getByRole('button', { name: 'поставить лайк. Лайков: 0' })).toBeInTheDocument()

    rerender(<SkillCard {...baseProps} isLiked onAction={onAction} />)
    await user.click(screen.getByRole('button', { name: 'убрать лайк' }))
    expect(onAction).toHaveBeenCalledTimes(2)
    expect(onAction).toHaveBeenLastCalledWith('like')
  })

  it('не переносит локальную заявку на другой навык', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const { rerender } = render(<SkillCard {...baseProps} onAction={onAction} />)
    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))

    rerender(
      <SkillCard
        {...baseProps}
        skill={{ ...skill, id: 'skill-2', title: 'Игра на гитаре' }}
        onAction={onAction}
      />,
    )

    const exchangeButton = screen.getByRole('button', { name: 'Предложить обмен' })
    expect(exchangeButton).toBeEnabled()
    await user.click(exchangeButton)
    expect(onAction).toHaveBeenCalledTimes(2)
    expect(onAction.mock.calls).toEqual([['exchange'], ['exchange']])
  })

  it('показывает заглушку карусели, если у навыка нет изображений', () => {
    render(<SkillCard {...baseProps} skill={{ ...skill, images: [] }} onAction={vi.fn()} />)

    expect(screen.getByRole('status')).toHaveTextContent('Изображения отсутствуют')
    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()
  })

  it('не отображает кнопку предложения обмена для собственного навыка', () => {
    render(<SkillCard {...baseProps} isOwnSkill onAction={vi.fn()} />)

    expect(screen.queryByRole('button', { name: 'Предложить обмен' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Обмен предложен' })).not.toBeInTheDocument()
  })
})
