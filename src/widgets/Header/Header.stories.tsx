import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { NotificationPanel } from '@/shared/ui/NotificationPanel'
import { Header } from './Header'
import type { HeaderProps } from './interface'

const mockSkillsMenu = (
  <div
    style={{
      padding: 'var(--space-24, 24px)',
      border: 'var(--border-inactive, 1px solid #e4e8df)',
      borderRadius: 'var(--border-radius-main, 12px)',
      backgroundColor: 'var(--color-bg-card, #fff)',
      minWidth: 320,
    }}
  >
    Категории и подкатегории навыков
  </div>
)

const mockNotificationPanel = (
  <NotificationPanel
    newItems={[
      {
        id: '1',
        text: 'Николай принял ваш обмен',
        description: 'Перейдите в профиль, чтобы обсудить детали',
        dateLabel: 'сегодня',
      },
    ]}
    viewedItems={[
      {
        id: '2',
        text: 'Олег предложил вам обмен',
        description: 'Примите обмен, чтобы обсудить детали',
        dateLabel: 'вчера',
      },
    ]}
    onGo={() => {}}
    onReadAll={() => {}}
    onClear={() => {}}
  />
)

const meta: Meta<typeof Header> = {
  title: 'Widgets/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ minHeight: 450 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: {
    searchValue: '',
    onSearchChange: () => {},
    onSearch: () => {},
    onLogin: () => {},
    onRegister: () => {},
    onLogout: () => {},
    skillsMenu: mockSkillsMenu,
    notificationPanel: mockNotificationPanel,
  },
  render: (args: HeaderProps) => {
    const [searchValue, setSearchValue] = useState(args.searchValue)

    return <Header {...args} searchValue={searchValue} onSearchChange={setSearchValue} />
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {
  args: {
    isAuthorized: false,
  },
}

export const Authorized: Story = {
  args: {
    isAuthorized: true,
    name: 'Мария',
    avatarUrl: '/img/avatars/avatar-01.png',
    hasNewNotifications: false,
  },
}

export const WithNewNotifications: Story = {
  args: {
    isAuthorized: true,
    name: 'Мария',
    avatarUrl: '/img/avatars/avatar-01.png',
    hasNewNotifications: true,
  },
}
