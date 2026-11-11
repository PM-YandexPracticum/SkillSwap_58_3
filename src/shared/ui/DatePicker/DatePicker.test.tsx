import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './DatePicker'

const LABEL = 'Дата рождения'

const Wrapper = ({ initial = null }: { initial?: Date | null }) => {
  const [value, setValue] = useState<Date | null>(initial)

  return <DatePicker label={LABEL} value={value} onChange={setValue} />
}

describe('DatePicker', () => {
  it('disables the confirm button while no date is picked', async () => {
    render(<Wrapper />)

    await userEvent.click(screen.getByLabelText(LABEL))

    expect(screen.getByRole('button', { name: 'Выбрать' })).toBeDisabled()
  })

  it('enables the confirm button once a valid date is typed', async () => {
    render(<Wrapper />)
    const input = screen.getByLabelText(LABEL)

    await userEvent.click(input)
    await userEvent.type(input, '27041995')

    expect(screen.getByRole('button', { name: 'Выбрать' })).toBeEnabled()
  })

  it('splits typed digits into dd.mm.yyyy', async () => {
    render(<Wrapper />)
    const input = screen.getByLabelText(LABEL)

    await userEvent.click(input)
    await userEvent.type(input, '27041995')

    expect(input).toHaveValue('27.04.1995')
  })

  it('ignores every character except digits', async () => {
    render(<Wrapper />)
    const input = screen.getByLabelText(LABEL)

    await userEvent.click(input)
    await userEvent.type(input, 'ab27-.04/zz1995!')

    expect(input).toHaveValue('27.04.1995')
  })

  it('keeps the confirm button enabled for a preselected date', async () => {
    render(<Wrapper initial={new Date(1995, 9, 28)} />)

    await userEvent.click(screen.getByLabelText(LABEL))

    expect(screen.getByRole('button', { name: 'Выбрать' })).toBeEnabled()
  })
})
