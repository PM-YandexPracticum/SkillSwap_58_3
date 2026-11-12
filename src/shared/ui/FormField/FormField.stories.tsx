import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormField } from './FormField'

const inputStyle = {
  width: '100%',
  minHeight: 48,
  padding: '12px 20px',
  borderRadius: 12,
  border: '1px solid var(--color-text-additional, #69735d)',
  fontSize: 16,
  backgroundColor: 'var(--color-bg-card, #fff)',
}

const meta = {
  title: 'Shared/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'email',
    label: 'Email',
    children: <input id="email" type="email" placeholder="Введите email" style={inputStyle} />,
  },
}

export const WithHint: Story = {
  args: {
    id: 'password',
    label: 'Пароль',
    hint: 'Пароль должен содержать не менее 8 знаков',
    children: (
      <input
        id="password"
        type="password"
        placeholder="Придумайте надёжный пароль"
        style={inputStyle}
      />
    ),
  },
}

export const WithError: Story = {
  args: {
    id: 'email-error',
    label: 'Email',
    error: 'Некорректный формат email',
    children: (
      <input id="email-error" type="email" placeholder="Введите email" style={inputStyle} />
    ),
  },
}
