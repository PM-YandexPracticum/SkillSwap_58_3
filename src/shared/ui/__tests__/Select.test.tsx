import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Select } from '../Select/Select'

const options = [
  { value: 'unspecified', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

afterEach(cleanup)

describe('Select', () => {
  it('показывает placeholder и обновляет подпись при внешнем изменении value', () => {
    const props = {
      options,
      value: '',
      onChange: vi.fn(),
      label: 'Пол',
      placeholder: 'Выберите пол',
    }
    const { rerender } = render(<Select {...props} />)
    const control = screen.getByRole('combobox', { name: 'Пол' })
    expect(control).toHaveTextContent('Выберите пол')
    expect(control).toHaveAttribute('aria-expanded', 'false')
    rerender(<Select {...props} value="female" />)
    expect(screen.getByRole('combobox', { name: 'Пол' })).toHaveTextContent('Женский')
  })

  it('передаёт value выбранного пункта один раз и закрывает список', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select options={options} value="" onChange={onChange} label="Пол" />)
    const control = screen.getByRole('combobox')
    expect(control.querySelector('use')).toHaveAttribute('href', '/icons/sprite.svg#chevron-down')
    await user.click(control)
    expect(control.querySelector('use')).toHaveAttribute('href', '/icons/sprite.svg#chevron-up')
    await user.click(screen.getByRole('option', { name: 'Мужской' }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('male')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(control.querySelector('use')).toHaveAttribute('href', '/icons/sprite.svg#chevron-down')
  })

  it('открывает список стрелками и выбирает активный пункт через Enter', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select options={options} value="" onChange={onChange} label="Пол" />)
    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(await screen.findByRole('listbox')).toBeVisible()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('male')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('выбирает первый вариант после заполнения открытого пустого списка', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const props = { value: '', onChange, label: 'Пол' }
    const { rerender } = render(<Select {...props} options={[]} />)
    await user.tab()
    await user.keyboard('{ArrowUp}')
    rerender(<Select {...props} options={options} />)
    const control = screen.getByRole('combobox', { name: 'Пол' })
    const firstOption = screen.getByRole('option', { name: 'Не указан' })
    expect(control).toHaveAttribute('aria-activedescendant', firstOption.id)
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('unspecified')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('закрывает список по Escape и клику снаружи без изменения value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <>
        <Select options={options} value="female" onChange={onChange} label="Пол" />
        <button type="button">Снаружи</button>
      </>,
    )
    const control = screen.getByRole('combobox')
    await user.click(control)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    await user.click(control)
    await user.click(screen.getByRole('button', { name: 'Снаружи' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(control).toHaveTextContent('Женский')
    expect(onChange).not.toHaveBeenCalled()
  })
})
