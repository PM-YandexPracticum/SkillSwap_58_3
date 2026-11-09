import { cloneElement } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { NotificationButton } from '../NotificationButton'
import { NotificationPanel } from '../NotificationPanel'
import { Dropdown } from './Dropdown'
import type { DropdownProps } from './interface'

const contentStyle = {
  display: 'grid',
  gap: 'var(--space-8)',
  padding: 'var(--space-16)',
  border: 'var(--border-main)',
  borderRadius: 'var(--border-radius-main)',
}

const meta = {
  title: 'Shared/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    trigger: <Button variant="outline">Открыть панель</Button>,
    isOpen: false,
    onClose: fn(),
    ariaLabel: 'Выпадающая панель',
    children: <div style={contentStyle}>Содержимое панели приходит снаружи.</div>,
  },
  argTypes: {
    trigger: { control: false },
    children: { control: false },
  },
  render: function Render(args: DropdownProps) {
    const [{ isOpen }, updateArgs] = useArgs<DropdownProps>()

    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 800 }}>
        <div style={{ alignSelf: 'flex-start' }}>
          <Dropdown
            {...args}
            isOpen={isOpen}
            trigger={cloneElement(args.trigger, {
              onClick: () => updateArgs({ isOpen: !isOpen }),
            })}
            onClose={() => {
              args.onClose()
              updateArgs({ isOpen: false })
            }}
          />
        </div>
      </div>
    )
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  name: 'Закрыт',
}

export const WithText: Story = {
  name: 'Открыт с текстом',
  args: { isOpen: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Открыть панель' })
    await expect(canvas.getByRole('group', { name: 'Выпадающая панель' })).toBeVisible()
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toHaveFocus()
  },
}

export const WithMenu: Story = {
  name: 'Открыт с меню из двух пунктов',
  args: {
    isOpen: true,
    ariaLabel: 'Меню профиля',
    children: (
      <div style={contentStyle}>
        <Button variant="link" onClick={fn()}>
          Личный кабинет
        </Button>
        <Button variant="link" onClick={fn()}>
          Выйти
        </Button>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Личный кабинет' }))
    await expect(canvas.getByRole('group', { name: 'Меню профиля' })).toBeVisible()
  },
}

export const Notifications: Story = {
  name: 'Уведомления под колокольчиком',
  args: {
    isOpen: true,
    ariaLabel: 'Уведомления',
    trigger: <NotificationButton hasNew onClick={fn()} />,
    children: (
      <NotificationPanel
        newItems={[
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
        ]}
        viewedItems={[
          {
            id: '3',
            text: 'Олег принял ваш обмен',
            description: 'Перейдите в профиль, чтобы обсудить детали',
            dateLabel: 'вчера',
          },
        ]}
        onGo={fn()}
        onReadAll={fn()}
        onClear={fn()}
      />
    ),
  },
}
