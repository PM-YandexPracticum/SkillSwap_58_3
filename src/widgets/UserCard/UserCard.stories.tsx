import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import '@/app/styles/global.css'
import { UserCard } from './UserCard'
import type { UserCardProps, UserCardSkill } from './interface'

const drums: UserCardSkill = { id: 'drums', label: 'Игра на барабанах', categoryId: 'creativity' }
const timeManagement: UserCardSkill = {
  id: 'time',
  label: 'Тайм менеджмент',
  categoryId: 'business',
}
const meditation: UserCardSkill = { id: 'meditation', label: 'Медитация', categoryId: 'health' }
const english: UserCardSkill = { id: 'english', label: 'Английский язык', categoryId: 'languages' }
const cooking: UserCardSkill = { id: 'cooking', label: 'Кулинария', categoryId: 'home' }

// состояние сердечка живёт в сторибуке, чтобы лайк можно было нажать
function UserCardPreview({ isLiked: initialIsLiked = false, onLike, ...args }: UserCardProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)

  const handleLike = () => {
    setIsLiked((liked) => !liked)
    onLike?.()
  }

  return (
    <div style={{ width: 324 }}>
      <UserCard {...args} isLiked={isLiked} onLike={handleLike} />
    </div>
  )
}

const meta = {
  title: 'Widgets/UserCard',
  component: UserCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    variant: 'catalog',
    name: 'Иван',
    avatarUrl: '/img/avatars/avatar-01.png',
    city: 'Санкт-Петербург',
    birthday: '1992-05-15',
    description: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
    teach: [drums],
    learn: [timeManagement, meditation],
    isLiked: false,
    onLike: fn(),
    onDetails: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['catalog', 'preview'] },
    birthday: { control: 'text' },
  },
  render: (args) => <UserCardPreview {...args} />,
} satisfies Meta<typeof UserCard>

export default meta
type Story = StoryObj<typeof meta>

// Каталог
export const Catalog: Story = {}

// Каталог, когда навыков больше двух: лишние заменяются на +n
export const CatalogWithMoreTags: Story = {
  args: {
    teach: [drums, english, cooking],
    learn: [timeManagement, meditation, english, cooking],
  },
}

// Каталог с поставленным лайком
export const CatalogLiked: Story = {
  args: { isLiked: true },
}

// Превью с описанием
export const PreviewWithDescription: Story = {
  args: { variant: 'preview' },
}

// Без аватара показывается заглушка
export const WithoutAvatar: Story = {
  args: { avatarUrl: null },
}
