import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UserCard } from './UserCard'
import type { UserCardProps, UserCardSkill } from './interface'

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 4, 15))
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const drums: UserCardSkill = { id: 'drums', label: 'Игра на барабанах', categoryId: 'creativity' }
const timeManagement: UserCardSkill = {
  id: 'time',
  label: 'Тайм менеджмент',
  categoryId: 'business',
}
const meditation: UserCardSkill = { id: 'meditation', label: 'Медитация', categoryId: 'health' }
const english: UserCardSkill = { id: 'english', label: 'Английский язык', categoryId: 'languages' }
const cooking: UserCardSkill = { id: 'cooking', label: 'Кулинария', categoryId: 'home' }

const baseProps: UserCardProps = {
  variant: 'catalog',
  name: 'Иван',
  avatarUrl: '/img/avatars/avatar-01.png',
  city: 'Санкт-Петербург',
  birthday: '1992-05-15',
  teach: [drums],
  learn: [timeManagement, meditation],
}

describe('UserCard', () => {
  it('renders the user as an article with the name in a heading', () => {
    render(<UserCard {...baseProps} />)

    const article = screen.getByRole('article')
    const heading = within(article).getByRole('heading', { name: 'Иван' })

    expect(article).toHaveAccessibleName('Иван')
    expect(heading).toBeInTheDocument()
  })

  it('shows the city and the age with the right ending', () => {
    render(<UserCard {...baseProps} />)

    expect(screen.getByText('Санкт-Петербург, 34 года')).toBeInTheDocument()
  })

  it('shows the previous age before the birthday', () => {
    render(<UserCard {...baseProps} birthday="1992-05-16" />)

    expect(screen.getByText('Санкт-Петербург, 33 года')).toBeInTheDocument()
  })

  it('shows zero age for an invalid birthday', () => {
    render(<UserCard {...baseProps} birthday="1992-02-31" />)

    expect(screen.getByText('Санкт-Петербург, 0 лет')).toBeInTheDocument()
  })

  describe('skills', () => {
    it('shows both groups with their tags', () => {
      render(<UserCard {...baseProps} />)

      const teach = screen.getByRole('list', { name: /Может научить/ })
      const learn = screen.getByRole('list', { name: /Хочет научиться/ })

      expect(within(teach).getByText('Игра на барабанах')).toBeInTheDocument()
      expect(within(learn).getByText('Тайм менеджмент')).toBeInTheDocument()
      expect(within(learn).getByText('Медитация')).toBeInTheDocument()
    })

    it('shows at most two tags and replaces the rest with +n', () => {
      render(<UserCard {...baseProps} learn={[timeManagement, meditation, english, cooking]} />)

      const learn = screen.getByRole('list', { name: /Хочет научиться/ })

      expect(within(learn).getByText('Тайм менеджмент')).toBeInTheDocument()
      expect(within(learn).getByText('Медитация')).toBeInTheDocument()
      expect(within(learn).queryByText('Английский язык')).not.toBeInTheDocument()
      expect(within(learn).queryByText('Кулинария')).not.toBeInTheDocument()
      expect(within(learn).getByText('+2')).toBeInTheDocument()
    })

    it('does not show +n when there are exactly two tags', () => {
      render(<UserCard {...baseProps} />)

      expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument()
    })

    it('hides the group title when the group is empty', () => {
      render(<UserCard {...baseProps} teach={[]} />)

      expect(screen.queryByText(/Может научить/)).not.toBeInTheDocument()
      expect(screen.getByText(/Хочет научиться/)).toBeInTheDocument()
    })
  })

  describe('catalog variant', () => {
    it('calls onDetails by the «Подробнее» button', async () => {
      const onDetails = vi.fn()
      render(<UserCard {...baseProps} onDetails={onDetails} />)

      await userEvent.click(screen.getByRole('button', { name: 'Подробнее' }))

      expect(onDetails).toHaveBeenCalledTimes(1)
    })

    it('calls onLike by the heart', async () => {
      const onLike = vi.fn()
      render(<UserCard {...baseProps} isLiked={false} onLike={onLike} />)

      await userEvent.click(screen.getByRole('button', { name: /поставить лайк/ }))

      expect(onLike).toHaveBeenCalledTimes(1)
    })

    it('shows the liked state of the heart', () => {
      render(<UserCard {...baseProps} isLiked onLike={vi.fn()} />)

      expect(screen.getByRole('button', { name: 'убрать лайк' })).toBeInTheDocument()
    })

    it('uses colon after group titles', () => {
      render(<UserCard {...baseProps} />)

      expect(screen.getByText('Может научить:')).toBeInTheDocument()
      expect(screen.getByText('Хочет научиться:')).toBeInTheDocument()
    })

    it('does not show the description', () => {
      render(<UserCard {...baseProps} description="Люблю ритм" />)

      expect(screen.queryByText('Люблю ритм')).not.toBeInTheDocument()
    })
  })

  describe('preview variant', () => {
    const previewProps: UserCardProps = {
      ...baseProps,
      variant: 'preview',
      description: 'Привет! Люблю ритм, кофе по утрам',
      isLiked: true,
      onLike: vi.fn(),
      onDetails: vi.fn(),
    }

    it('shows the description', () => {
      render(<UserCard {...previewProps} />)

      expect(screen.getByText('Привет! Люблю ритм, кофе по утрам')).toBeInTheDocument()
    })

    it('has neither the heart nor the «Подробнее» button', () => {
      render(<UserCard {...previewProps} />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('writes group titles without colon', () => {
      render(<UserCard {...previewProps} />)

      expect(screen.getByText('Может научить')).toBeInTheDocument()
      expect(screen.getByText('Хочет научиться')).toBeInTheDocument()
    })
  })

  describe('avatar', () => {
    it('shows the photo when avatarUrl is given', () => {
      const { container } = render(<UserCard {...baseProps} />)

      expect(container.querySelector('img')).toHaveAttribute('src', '/img/avatars/avatar-01.png')
    })

    it('shows the placeholder without the photo', () => {
      const { container } = render(<UserCard {...baseProps} avatarUrl={null} />)

      expect(container.querySelector('img')).not.toBeInTheDocument()
    })
  })
})
