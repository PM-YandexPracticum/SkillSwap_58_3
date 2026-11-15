import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './Divider'

const meta = {
  title: 'Shared/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    text: 'или',
  },
  argTypes: {
    text: { description: 'Текст между линиями. По умолчанию — «или»' },
  },
} satisfies Meta<typeof Divider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomText: Story = {
  args: {
    text: 'или продолжите через',
  },
}
