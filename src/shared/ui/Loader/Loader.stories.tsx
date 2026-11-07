import { Meta, StoryObj } from '@storybook/react-vite'
import { Loader } from './Loader'

const meta: Meta<typeof Loader> = {
  title: 'Shared/Loader',
  component: Loader,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['small', 'medium'],
      control: { type: 'select' },
      description: 'размер лоадера',
    },
  },
}

export default meta

type Story = StoryObj<typeof Loader>

export const Medium: Story = {
  args: {
    size: 'medium',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
  },
}
