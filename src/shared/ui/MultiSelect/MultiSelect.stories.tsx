import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import '@/app/styles/global.css'
import { MultiSelect } from './MultiSelect'
import type { MultiSelectProps } from './interface'

const options = [
  { value: 'business', label: 'Бизнес и карьера' },
  { value: 'art', label: 'Творчество и искусство' },
  { value: 'languages', label: 'Иностранные языки' },
  { value: 'education', label: 'Образование и развитие' },
]

const meta = {
  title: 'Shared/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],

  render: (args) => {
    const [{ value }, updateArgs] = useArgs<MultiSelectProps>()

    return (
      <MultiSelect
        {...args}
        value={value}
        onChange={(newValues) => updateArgs({ value: newValues })}
      />
    )
  },

  args: {
    options,
    value: [],
    onChange: () => {},
    placeholder: 'Выберите категории',
    label: 'Категории',
  },
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  args: {
    options,
    value: [],
    placeholder: 'Выберите категорию',
    label: 'Категория навыка',
    onChange: () => {},
  },
}

export const Opened: Story = {
  args: {
    options,
    value: [],
    placeholder: 'Выберите категорию',
    label: 'Категория навыка',
    defaultOpen: true,
    onChange: () => {},
  },
}

export const SingleSelected: Story = {
  args: {
    options,
    value: ['business'],
    placeholder: 'Выберите категорию',
    label: 'Категория навыка',
    onChange: () => {},
  },
}

export const MultipleSelected: Story = {
  args: {
    options,
    value: ['business', 'art', 'languages'],
    placeholder: 'Выберите категорию',
    label: 'Категория навыка',
    onChange: () => {},
  },
}

export const Disabled: Story = {
  args: {
    value: ['business'],
    disabled: true,
    defaultOpen: false,
  },
}
