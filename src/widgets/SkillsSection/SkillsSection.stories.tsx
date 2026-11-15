import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import '@/app/styles/global.css'
import { Button } from '@/shared/ui/Button'
import { SkillsSection } from './SkillsSection'
import type { SkillsSectionItem } from './interface'
import { Icon } from '@/shared/ui/icons'

const items: SkillsSectionItem[] = [
  {
    id: '1',
    name: 'Иван',
    avatarUrl: '/img/avatars/avatar-01.png',
    city: 'Санкт-Петербург',
    age: 34,
    teach: [{ id: 'drums', label: 'Игра на барабанах', categoryId: 'creativity' }],
    learn: [{ id: 'time', label: 'Тайм менеджмент', categoryId: 'business' }],
  },
  {
    id: '2',
    name: 'Анна',
    city: 'Москва',
    age: 27,
    teach: [{ id: 'english', label: 'Английский язык', categoryId: 'languages' }],
    learn: [{ id: 'cooking', label: 'Кулинария', categoryId: 'home' }],
  },
  {
    id: '3',
    name: 'Максим',
    city: 'Казань',
    age: 29,
    teach: [{ id: 'meditation', label: 'Медитация', categoryId: 'health' }],
    learn: [{ id: 'drums', label: 'Игра на барабанах', categoryId: 'creativity' }],
  },
]

const meta = {
  title: 'Widgets/SkillsSection',
  component: SkillsSection,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Точное совпадение',
    items,
  },
} satisfies Meta<typeof SkillsSection>

export default meta

type Story = StoryObj<typeof meta>

export const WithViewAll: Story = {
  args: {
    actions: (
      <Button variant="outline" iconRight={<Icon name="chevron-right" size={24} />} onClick={fn()}>
        Смотреть все
      </Button>
    ),
  },
}

export const WithSorting: Story = {
  args: {
    title: 'Новые идеи',
    actions: <Button onClick={fn()}>По дате</Button>,
  },
}

export const WithoutActions: Story = {
  args: {
    title: 'Избранное',
  },
}

export const FourColumns: Story = {
  name: 'Четыре колонки',
  args: {
    title: 'Вам может понравиться',
    columns: 4,
    items: [
      ...items,
      {
        id: '4',
        name: 'Елена',
        avatarUrl: '/img/avatars/avatar-04.png',
        city: 'Екатеринбург',
        age: 31,
        teach: [{ id: 'cooking', label: 'Кулинария', categoryId: 'home' }],
        learn: [{ id: 'english', label: 'Английский язык', categoryId: 'languages' }],
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    title: 'Избранное',
    items: [],
  },
}
