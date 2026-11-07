import type { Meta, StoryObj } from '@storybook/react-vite'
import '@/app/styles/global.css'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Shared/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    checked: false,
  },
}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Запомнить меня',
    checked: true,
  },
}
