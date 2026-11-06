import type { Meta, StoryObj } from '@storybook/react-vite'
import '@/app/styles/global.css'
import { Icon } from '../icons'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline'],
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Подробнее',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Обмен предложен',
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Неактивная кнопка',
    disabled: true,
  },
}

export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    children: 'Предложить обмен',
    iconLeft: <Icon name="plus" size={18} />,
  },
}

export const WithIconRight: Story = {
  args: {
    variant: 'outline',
    children: 'Перейти к профилю',
    iconRight: <Icon name="chevron-right" size={18} />,
  },
}
