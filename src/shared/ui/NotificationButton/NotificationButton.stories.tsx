import { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationButton } from './NotificationButton'

const meta: Meta<typeof NotificationButton> = {
  title: 'Shared/NotificationButton',
  component: NotificationButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
}

export default meta

type Story = StoryObj<typeof NotificationButton>

export const Default: Story = {
  args: {
    hasNew: false,
  },
}

export const HasNew: Story = {
  args: {
    hasNew: true,
  },
}
