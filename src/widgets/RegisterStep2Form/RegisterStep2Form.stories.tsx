import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { fn } from 'storybook/test'
import '@/app/styles/global.css'
import { RegisterStep2Form } from './RegisterStep2Form'
import type { RegisterStep2FormProps } from './interface'

const meta = {
  title: 'Widgets/RegisterStep2Form',
  component: RegisterStep2Form,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    values: {
      name: '',
      birthday: null,
      gender: 'unspecified',
      cityId: '',
      categoryIds: [],
      subcategoryIds: [],
    },
    cityOptions: [
      { value: 'moscow', label: 'Москва' },
      { value: 'saint-petersburg', label: 'Санкт-Петербург' },
    ],
    categoryOptions: [
      { value: 'art', label: 'Творчество и искусство' },
      { value: 'languages', label: 'Иностранные языки' },
    ],
    subcategoryOptions: [
      { value: 'watercolor', label: 'Рисование акварелью' },
      { value: 'illustration', label: 'Иллюстрация' },
      { value: 'english', label: 'Английский язык' },
    ],
    onChange: fn(),
    onAvatarAdd: fn(),
    onBack: fn(),
    onSubmit: fn(),
  },
  render: (args) => {
    const [{ values }, updateArgs] = useArgs<RegisterStep2FormProps>()

    return (
      <RegisterStep2Form
        {...args}
        values={values}
        onChange={(next) => {
          updateArgs({ values: next })
          args.onChange(next)
        }}
      />
    )
  },
} satisfies Meta<typeof RegisterStep2Form>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { name: 'Пустая форма' }

export const Filled: Story = {
  name: 'Заполненная форма',
  args: {
    values: {
      avatarUrl: '/img/avatars/avatar-01.png',
      name: 'Мария',
      birthday: new Date(1995, 9, 28),
      gender: 'female',
      cityId: 'moscow',
      categoryIds: ['art'],
      subcategoryIds: ['watercolor'],
    },
  },
}

export const WithErrors: Story = {
  name: 'С ошибками',
  args: {
    errors: {
      avatarUrl: 'Добавьте фотографию',
      name: 'Введите имя',
      birthday: 'Укажите дату рождения',
      gender: 'Укажите пол',
      cityId: 'Выберите город',
      categoryIds: 'Выберите категорию',
      subcategoryIds: 'Выберите подкатегорию',
    },
  },
}
