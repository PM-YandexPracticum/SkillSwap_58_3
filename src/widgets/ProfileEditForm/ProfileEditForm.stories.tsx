import type { Meta, StoryObj } from '@storybook/react-vite'
import type { User } from '@/shared/types'
import { ProfileEditForm } from './ProfileEditForm'

const mockUser: User = {
  id: 'user-1',
  name: 'Мария',
  email: 'Mariia@gmail.com',
  avatarUrl: '/img/avatars/avatar-01.png',
  createdAt: '2024-01-01',
  password: 'password123',
  town: 'moscow',
  birthday: '28.10.1995',
  likedCount: 15,
  description:
    'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
  gender: 'female',
  learn: [],
  favourites: [],
}

const meta = {
  title: 'Widgets/ProfileEditForm',
  component: ProfileEditForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    currentUser: mockUser,
    onSave: () => {},
  },
} satisfies Meta<typeof ProfileEditForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    currentUser: null,
  },
}

export const WithErrors: Story = {
  args: {
    currentUser: mockUser,
    errors: {
      email: 'Некорректный email',
      name: 'Имя не может быть пустым',
      password: 'Минимум 8 символов',
    },
  },
}
