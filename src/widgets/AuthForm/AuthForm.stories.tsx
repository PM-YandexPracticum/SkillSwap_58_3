import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AuthForm } from './AuthForm'

const meta = {
  title: 'Widgets/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(),
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['login', 'registration'],
    },
    onSubmit: { description: 'Срабатывает при отправке формы, возвращает поля формы' },
    savedValues: { description: 'Ранее сохранённые значения полей' },
    errors: { description: 'Ошибки валидации по полям' },
  },
} satisfies Meta<typeof AuthForm>

export default meta

type Story = StoryObj<typeof meta>

export const Login = {
  args: {
    variant: 'login',
  },
}

export const Registration: Story = {
  args: {
    variant: 'registration',
    savedValues: { email: '@123', password: '345' },
  },
}

export const WithSavedValues: Story = {
  args: {
    variant: 'login',
    savedValues: {
      email: 'user@example.com',
      password: '',
    },
  },
}

export const WithErrors: Story = {
  args: {
    variant: 'login',
    savedValues: {
      email: 'not-an-email',
      password: '123',
    },
    errors: {
      email: 'Введите корректный email',
      password: 'Пароль должен содержать не менее 8 знаков',
    },
  },
}
