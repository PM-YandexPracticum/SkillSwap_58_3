import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import '@/app/styles/global.css'
import { RegisterStep3Form } from './RegisterStep3Form'
import type { RegisterStep3FormProps, RegisterStep3Values, SubcategoryOption } from './interface'

const categoryOptions = [
  { value: 'business', label: 'Бизнес и карьера' },
  { value: 'languages', label: 'Иностранные языки' },
  { value: 'creativity', label: 'Творчество и искусство' },
]

const subcategoryOptions: SubcategoryOption[] = [
  { value: 'management', label: 'Управление командой', categoryId: 'business' },
  { value: 'english', label: 'Английский язык', categoryId: 'languages' },
  { value: 'drums', label: 'Игра на барабанах', categoryId: 'creativity' },
]

const emptyValues: RegisterStep3Values = {
  title: '',
  categoryId: '',
  subcategoryId: '',
  description: '',
  images: [],
}

const filledValues: RegisterStep3Values = {
  title: 'Игра на барабанах',
  categoryId: 'creativity',
  subcategoryId: 'drums',
  description: 'Научу играть простые ритмы и держать темп',
  images: [],
}

// значения живут в сторибуке, чтобы поля можно было менять
function RegisterStep3FormPreview({ values: initialValues, ...args }: RegisterStep3FormProps) {
  const [values, setValues] = useState(initialValues)

  const handleChange = (next: RegisterStep3Values) => {
    setValues(next)
    args.onChange(next)
  }

  return (
    <div style={{ maxWidth: 412 }}>
      <RegisterStep3Form {...args} values={values} onChange={handleChange} />
    </div>
  )
}

const meta: Meta<typeof RegisterStep3Form> = {
  title: 'Widgets/RegisterStep3Form',
  component: RegisterStep3Form,
  render: (args) => <RegisterStep3FormPreview {...args} />,
  args: {
    values: emptyValues,
    categoryOptions,
    subcategoryOptions,
    onChange: fn(),
    onBack: fn(),
    onSubmit: fn(),
  },
}

export default meta
type Story = StoryObj<typeof RegisterStep3Form>

export const Empty: Story = {}

export const Filled: Story = {
  args: { values: filledValues },
}

export const WithErrors: Story = {
  args: {
    errors: {
      title: 'Введите название навыка',
      categoryId: 'Выберите категорию',
      subcategoryId: 'Выберите подкатегорию',
      description: 'Добавьте описание',
      images: 'Добавьте хотя бы одно изображение',
    },
  },
}
