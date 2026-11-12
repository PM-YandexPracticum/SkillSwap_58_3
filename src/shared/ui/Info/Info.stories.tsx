import type { Meta, StoryObj } from '@storybook/react-vite'
import '@/app/styles/global.css'
import { Info } from './Info'

const meta = {
  title: 'Shared/Info',
  component: Info,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['registration', 'error'],
    },
    image: {
      control: 'select',
      options: ['light-bulb', 'user-info', 'school-board', 'error-404', 'error-500'],
    },
  },
} satisfies Meta<typeof Info>

export default meta
type Story = StoryObj<typeof meta>

export const RegistrationWelcome: Story = {
  name: 'Регистрация — шаг 1',
  args: {
    image: 'light-bulb',
    variant: 'registration',
    title: 'Добро пожаловать в SkillSwap!',
    description: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
    alt: 'Лампочка как символ обмена знаниями',
  },
}

export const RegistrationAbout: Story = {
  name: 'Регистрация — шаг 2',
  args: {
    image: 'user-info',
    variant: 'registration',
    title: 'Расскажите немного о себе',
    description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
    alt: 'Пользователь рассказывает о себе',
  },
}

export const Registration: Story = {
  name: 'Регистрация — шаг 3',
  args: {
    image: 'school-board',
    variant: 'registration',
    title: 'Укажите, чем вы готовы поделиться',
    description: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
    alt: 'Доска для объяснения навыка',
  },
}

export const Error: Story = {
  name: 'Страница не найдена',
  args: {
    image: 'error-404',
    variant: 'error',
    title: 'Страница не найдена',
    description:
      'К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже',
    alt: 'Монитор с ошибкой 404',
  },
}

export const ServerError: Story = {
  name: 'Ошибка сервера',
  args: {
    image: 'error-500',
    variant: 'error',
    title: 'На сервере произошла ошибка',
    description: 'Попробуйте позже или вернитесь на главную страницу',
    alt: 'Монитор с ошибкой 500',
  },
}
