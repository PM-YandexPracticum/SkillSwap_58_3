import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test'
import '@/app/styles/global.css'
import { ImageUpload } from './ImageUpload'

const png = new File(['image'], 'рисование.png', { type: 'image/png' })
const jpeg = new File(['image'], 'урок.jpg', { type: 'image/jpeg' })

const meta = {
  title: 'Shared/ImageUpload',
  component: ImageUpload,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { files: [], onChange: fn(), onRemove: fn() },
  argTypes: { files: { control: false } },
  render: function Render(args) {
    const [files, setFiles] = useState(args.files)
    return (
      <div style={{ width: 436, maxWidth: '100%' }}>
        <ImageUpload
          {...args}
          files={files}
          onChange={(nextFiles) => {
            args.onChange(nextFiles)
            setFiles(nextFiles)
          }}
          onRemove={(index) => {
            args.onRemove(index)
            setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
          }}
        />
      </div>
    )
  },
} satisfies Meta<typeof ImageUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Initial: Story = {
  name: 'Начальное поле',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Выбрать изображения') as HTMLInputElement
    await userEvent.upload(input, png)
    await expect(args.onChange).toHaveBeenLastCalledWith([png])
    await userEvent.upload(input, jpeg)
    await expect(args.onChange).toHaveBeenLastCalledWith([png, jpeg])
    await expect(canvas.getByText(png.name)).toBeVisible()
    await expect(canvas.getByText(jpeg.name)).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: `Удалить ${png.name}` }))
    await expect(args.onRemove).toHaveBeenLastCalledWith(0)
    await expect(canvas.queryByText(png.name)).not.toBeInTheDocument()
    await userEvent.upload(input, png)
    await expect(args.onChange).toHaveBeenLastCalledWith([jpeg, png])
    await userEvent.click(canvas.getByRole('button', { name: `Удалить ${jpeg.name}` }))
    await userEvent.click(canvas.getByRole('button', { name: `Удалить ${png.name}` }))
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument()
  },
}

export const WithFiles: Story = {
  name: 'С загруженными файлами',
  args: { files: [png, jpeg] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Выбрать изображения') as HTMLInputElement
    const dropZone = input.parentElement!
    const dropFiles = (files: File[]) => {
      const dataTransfer = new DataTransfer()
      files.forEach((file) => dataTransfer.items.add(file))
      return fireEvent(
        dropZone,
        new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }),
      )
    }
    const extra = new File([new Uint8Array(2 * 1024 * 1024)], 'дополнение.png', {
      type: 'image/png',
    })
    const invalid = new File(['text'], 'заметки.txt', { type: 'text/plain' })
    const large = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'большой.png', {
      type: 'image/png',
    })
    const user = userEvent.setup({ applyAccept: false })
    await user.upload(input, invalid)
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Допускаются только изображения JPEG и PNG.',
    )
    await dropFiles([large])
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Размер каждого изображения не должен превышать 2 МБ.',
    )
    await dropFiles([extra, extra, extra, extra])
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Можно загрузить не более 5 изображений.',
    )
    await expect(args.onChange).not.toHaveBeenCalled()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2)
    await dropFiles([extra])
    await expect(args.onChange).toHaveBeenLastCalledWith([png, jpeg, extra])
    await expect(await canvas.findByText(extra.name)).toBeVisible()
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: `Удалить ${extra.name}` }))
    await expect(args.onRemove).toHaveBeenLastCalledWith(2)
  },
}

export const WithError: Story = {
  name: 'С ошибкой',
  args: { error: 'Можно загрузить не более 5 изображений.' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Выбрать изображения')
    const error = canvas.getByRole('alert')
    await expect(error).toHaveTextContent(args.error!)
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(error.id)
  },
}
