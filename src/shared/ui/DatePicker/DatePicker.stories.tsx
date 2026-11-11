import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import '@/app/styles/global.css'
import { DatePicker } from './DatePicker'
import type { DatePickerProps } from './interface'

function DatePickerPreview({ value: initialValue, onChange, ...args }: DatePickerProps) {
  const [value, setValue] = useState<Date | null>(initialValue)

  const handleChange = (date: Date | null) => {
    setValue(date)
    onChange(date)
  }

  return (
    <div style={{ width: 320, minHeight: 420 }}>
      <DatePicker {...args} value={value} onChange={handleChange} />
    </div>
  )
}

const meta = {
  title: 'Shared/DatePicker',
  component: DatePicker,
  args: {
    label: 'Дата рождения',
    placeholder: 'дд.мм.гггг',
    value: null,
    onChange: () => {},
  },
  argTypes: {
    value: { control: false },
    error: { control: 'text' },
  },
  render: (args) => <DatePickerPreview {...args} />,
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

// Пустое поле
export const Empty: Story = {}

// Открытый календарь
export const OpenedCalendar: Story = {
  args: { value: new Date(2000, 3, 27) },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByLabelText('Дата рождения'))
  },
}

// Выбранная дата
export const WithSelectedDate: Story = {
  args: { value: new Date(1995, 9, 28) },
}

// С ошибкой
export const WithError: Story = {
  args: { error: 'Укажите дату рождения' },
}
