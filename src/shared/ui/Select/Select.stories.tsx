import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { SelectProps } from './type'
import { Select } from './Select'

const meta = {
  title: 'Shared/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Пол',
    placeholder: 'Не указан',
    value: '',
    options: [
      { value: 'unspecified', label: 'Не указан' },
      { value: 'male', label: 'Мужской' },
      { value: 'female', label: 'Женский' },
    ],
    onChange: fn(),
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<SelectProps>()
    return (
      <div style={{ width: 436, maxWidth: '100%', paddingBottom: 240 }}>
        <Select
          {...args}
          value={value}
          onChange={(nextValue) => {
            args.onChange(nextValue)
            updateArgs({ value: nextValue })
          }}
        />
      </div>
    )
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = { name: 'Закрытый список' }

export const Opened: Story = {
  name: 'Открытый список',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Пол' }))
    await expect(canvas.getByRole('listbox')).toBeVisible()
  },
}

export const SelectedValue: Story = {
  name: 'С выбранным значением',
  args: { value: 'female' },
}
