import { Meta, StoryObj } from '@storybook/react-vite'
import type { NotificationItem } from '@/shared/types'
import { NotificationPanel } from './NotificationPanel'

const meta: Meta<typeof NotificationPanel> = {
  title: 'Shared/NotificationPanel',
  component: NotificationPanel,
  tags: ['autodocs'],
  argTypes: {
    onGo: { action: 'onGo clicked' },
    onReadAll: { action: 'onReadAll clicked' },
    onClear: { action: 'onClear clicked' },
  },
}

export default meta

type Story = StoryObj<typeof NotificationPanel>

const mockNewNotifications: NotificationItem[] = [
  {
    id: '1',
    text: 'Николай принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    dateLabel: 'сегодня',
  },
  {
    id: '2',
    text: 'Татьяна приняла ваш обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    dateLabel: 'сегодня',
  },
]

const mockViewedNotifications: NotificationItem[] = [
  {
    id: '3',
    text: 'Олег принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    dateLabel: 'вчера',
  },
  {
    id: '4',
    text: 'Игорь принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    dateLabel: '23 мая',
  },
]

export const Default: Story = {
  args: {
    newItems: mockNewNotifications,
    viewedItems: mockViewedNotifications,
  },
}

export const Empty: Story = {
  args: {
    newItems: [],
    viewedItems: [],
  },
}
