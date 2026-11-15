import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RegisterStep3Form } from './RegisterStep3Form'
import type { RegisterStep3FormProps, RegisterStep3Values, SubcategoryOption } from './interface'

const categoryOptions = [
  { value: 'business', label: 'Бизнес и карьера' },
  { value: 'languages', label: 'Иностранные языки' },
]

const subcategoryOptions: SubcategoryOption[] = [
  { value: 'management', label: 'Управление командой', categoryId: 'business' },
  { value: 'english', label: 'Английский язык', categoryId: 'languages' },
]

const emptyValues: RegisterStep3Values = {
  title: '',
  categoryId: '',
  subcategoryId: '',
  description: '',
  images: [],
}

function setup(props: Partial<RegisterStep3FormProps> = {}) {
  const onChange = vi.fn()
  const onBack = vi.fn()
  const onSubmit = vi.fn()
  render(
    <RegisterStep3Form
      values={emptyValues}
      onChange={onChange}
      categoryOptions={categoryOptions}
      subcategoryOptions={subcategoryOptions}
      onBack={onBack}
      onSubmit={onSubmit}
      {...props}
    />,
  )
  return { onChange, onBack, onSubmit }
}

describe('RegisterStep3Form', () => {
  it('показывает все поля и кнопки', () => {
    setup()

    expect(screen.getByLabelText('Название навыка')).toBeInTheDocument()
    expect(screen.getByText('Категория навыка')).toBeInTheDocument()
    expect(screen.getByText('Подкатегория навыка')).toBeInTheDocument()
    expect(screen.getByLabelText('Описание')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument()
  })

  it('передаёт новый объект значений целиком при вводе названия', async () => {
    const { onChange } = setup()

    await userEvent.type(screen.getByLabelText('Название навыка'), 'Ф')

    expect(onChange).toHaveBeenCalledWith({ ...emptyValues, title: 'Ф' })
  })

  it('передаёт новый объект значений при вводе описания', async () => {
    const { onChange } = setup()

    await userEvent.type(screen.getByLabelText('Описание'), 'О')

    expect(onChange).toHaveBeenCalledWith({ ...emptyValues, description: 'О' })
  })

  it('при выборе подкатегории проставляет её категорию', async () => {
    function Controlled() {
      const [values, setValues] = useState(emptyValues)
      return (
        <RegisterStep3Form
          values={values}
          onChange={setValues}
          categoryOptions={categoryOptions}
          subcategoryOptions={subcategoryOptions}
          onBack={vi.fn()}
          onSubmit={vi.fn()}
        />
      )
    }
    render(<Controlled />)

    await userEvent.click(screen.getByText('Выберите подкатегорию навыка'))
    await userEvent.click(screen.getByText('Английский язык'))

    expect(screen.getByText('Иностранные языки')).toBeInTheDocument()
  })

  it('сбрасывает подкатегорию, если она из другой категории', async () => {
    const { onChange } = setup({
      values: { ...emptyValues, categoryId: 'business', subcategoryId: 'management' },
    })

    await userEvent.click(screen.getByText('Бизнес и карьера'))
    await userEvent.click(screen.getByText('Иностранные языки'))

    expect(onChange).toHaveBeenCalledWith({
      ...emptyValues,
      categoryId: 'languages',
      subcategoryId: '',
    })
  })

  it('показывает ошибки по полям', () => {
    setup({
      errors: { title: 'Введите название навыка', categoryId: 'Выберите категорию' },
    })

    expect(screen.getByText('Введите название навыка')).toBeInTheDocument()
    expect(screen.getByText('Выберите категорию')).toBeInTheDocument()
  })

  it('вызывает onBack по кнопке Назад', async () => {
    const { onBack, onSubmit } = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Назад' }))

    expect(onBack).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('вызывает onSubmit по кнопке Продолжить', async () => {
    const { onSubmit } = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
