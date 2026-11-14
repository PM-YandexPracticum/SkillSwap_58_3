import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { fn } from 'storybook/test'
import '@/app/styles/global.css'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { AuthLayout } from './AuthLayout'

function FormPreview({
  label = 'Email',
  action = 'Продолжить',
}: {
  label?: string
  action?: string
}) {
  const [value, setValue] = useState('')

  return (
    <form
      style={{ display: 'grid', gap: 'var(--space-24, 24px)', width: 436 }}
      onSubmit={(event) => event.preventDefault()}
    >
      <Input
        label={label}
        placeholder={'Введите ' + label.toLowerCase()}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button type="submit">{action}</Button>
    </form>
  )
}

const meta = {
  title: 'Widgets/AuthLayout',
  component: AuthLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    title: 'Добро пожаловать в SkillSwap!',
    description: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
    illustrationSrc: '/img/auth/light-bulb.svg',
    onClose: fn(),
    children: <FormPreview action="Войти" />,
  },
} satisfies Meta<typeof AuthLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Login: Story = { name: 'Вход' }

export const RegistrationStep1: Story = {
  name: 'Регистрация — шаг 1',
  args: { currentStep: 1, children: <FormPreview action="Далее" /> },
}

export const RegistrationStep2: Story = {
  name: 'Регистрация — шаг 2',
  args: {
    currentStep: 2,
    title: 'Расскажите немного о себе',
    description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
    illustrationSrc: '/img/auth/user-info.svg',
    children: <FormPreview label="Имя" />,
  },
}

export const RegistrationStep3: Story = {
  name: 'Регистрация — шаг 3',
  args: {
    currentStep: 3,
    title: 'Укажите, чем вы готовы поделиться',
    description: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
    illustrationSrc: '/img/auth/school-board.svg',
    children: <FormPreview label="Название навыка" />,
  },
}
