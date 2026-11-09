import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import '@/app/styles/global.css'
import { SearchSelect } from './SearchSelect'
import { SearchSelectOption } from './interface'

const mockCities: SearchSelectOption[] = [
  { value: 'moscow', label: 'Москва' },
  { value: 'saint-petersburg', label: 'Санкт-Петербург' },
  { value: 'samara', label: 'Самара' },
  { value: 'saratov', label: 'Саратов' },
  { value: 'kazan', label: 'Казань' },
  { value: 'novosibirsk', label: 'Новосибирск' },
  { value: 'yekaterinburg', label: 'Екатеринбург' },
]

const meta: Meta<typeof SearchSelect> = {
  title: 'Shared/SearchSelect',
  component: SearchSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320, minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SearchSelect>

export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchSelect
        label="Город"
        placeholder="Не указан"
        value={value}
        onChange={setValue}
        onClear={() => setValue('')}
        options={mockCities}
      />
    )
  },
}

export const Selected: Story = {
  render: () => {
    const [value, setValue] = useState('saint-petersburg')
    return (
      <SearchSelect
        label="Город"
        placeholder="Не указан"
        value={value}
        onChange={setValue}
        onClear={() => setValue('')}
        options={mockCities}
      />
    )
  },
}

export const OpenedWithSearch: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchSelect
        label="Город"
        placeholder="Не указан"
        value={value}
        onChange={setValue}
        onClear={() => setValue('')}
        options={mockCities}
      />
    )
  },
}

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchSelect
        label="Город"
        placeholder="Не указан"
        value={value}
        onChange={setValue}
        onClear={() => setValue('')}
        options={mockCities}
        error="Поле обязательно для заполнения"
      />
    )
  },
}
