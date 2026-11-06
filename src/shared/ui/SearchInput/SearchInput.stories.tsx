import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SearchInput } from './SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'Shared/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SearchInput>

export const DefaultWithText: Story = {
  render: () => {
    const [value, setValue] = useState('Разработка на TypeScript')
    return (
      <SearchInput
        value={value}
        placeholder="Искать навык"
        onChange={(e) => setValue(e.target.value)}
        onSearch={() => alert(`Ищем "${value}"`)}
        onClear={() => setValue('')}
      />
    )
  },
}

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchInput
        value={value}
        placeholder="Искать навык"
        onChange={(e) => setValue(e.target.value)}
        onSearch={() => alert(`Ищем "${value}"`)}
        onClear={() => setValue('')}
      />
    )
  },
}
