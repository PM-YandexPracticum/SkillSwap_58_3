import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import '@/app/styles/global.css'
import { Avatar } from './Avatar'

const photo = '/img/avatars/avatar-01.png'
const sizes = [
  { value: 'small', label: 'Маленький (48 px)' },
  { value: 'medium', label: 'Средний (72 px)' },
  { value: 'large', label: 'Большой (100 px)' },
  { value: 'extraLarge', label: 'Очень большой (244 px)' },
] as const

const meta = {
  title: 'Shared/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { alt: 'Аватар пользователя', size: 'medium' },
  argTypes: {
    size: {
      control: 'select',
      options: sizes.map(({ value }) => value),
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithPhoto: Story = {
  name: 'С фотографией',
  args: { src: photo },
}

export const Placeholder: Story = {
  name: 'Без фотографии',
}

export const Editable: Story = {
  name: 'С редактированием',
  args: { src: photo, size: 'extraLarge', onEdit: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Редактировать фото' })
    await userEvent.click(trigger)
    await expect(canvas.getByRole('button', { name: 'Изменить' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Удалить' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Изменить' }))
    await expect(args.onEdit).toHaveBeenLastCalledWith('edit')
    await expect(canvas.queryByRole('group', { name: 'Действия с фото' })).not.toBeInTheDocument()
    await userEvent.click(trigger)
    await userEvent.click(canvas.getByRole('button', { name: 'Удалить' }))
    await expect(args.onEdit).toHaveBeenLastCalledWith('delete')
    await expect(args.onEdit).toHaveBeenCalledTimes(2)
    await expect(canvas.queryByRole('group', { name: 'Действия с фото' })).not.toBeInTheDocument()
  },
}

export const AllSizes: Story = {
  name: 'Все размеры',
  args: { src: photo },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-24, 24px)',
        flexWrap: 'wrap',
      }}
    >
      {sizes.map(({ value, label }) => (
        <figure
          key={value}
          style={{ display: 'grid', justifyItems: 'center', gap: 'var(--space-8, 8px)' }}
        >
          <Avatar {...args} size={value} />
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  ),
}

export const AddPhoto: Story = {
  name: 'С добавлением фотографии',
  args: { onAdd: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Добавить фото' }))
    await expect(args.onAdd).toHaveBeenCalledTimes(1)
  },
}
