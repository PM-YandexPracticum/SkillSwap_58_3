import type { Meta, StoryObj } from '@storybook/react-vite'
import '@/app/styles/global.css'
import { Tag } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Shared/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Business: Story = {
  args: {
    label: 'Бизнес и карьера',
    categoryId: 'business',
  },
}

export const Languages: Story = {
  args: {
    label: 'Иностранные языки',
    categoryId: 'languages',
  },
}

export const Home: Story = {
  args: {
    label: 'Дом и уют',
    categoryId: 'home',
  },
}

export const Creativity: Story = {
  args: {
    label: 'Игра на барабанах',
    categoryId: 'creativity',
  },
}

export const Education: Story = {
  args: {
    label: 'Тайм менеджмент',
    categoryId: 'education',
  },
}

export const Health: Story = {
  args: {
    label: 'Медитация',
    categoryId: 'health',
  },
}

export const IsMore: Story = {
  args: {
    label: '+2',
    isMore: true,
  },
}

export const WithRemove: Story = {
  args: {
    label: 'Медитация',
    categoryId: 'health',
    onRemove: () => {},
  },
}
