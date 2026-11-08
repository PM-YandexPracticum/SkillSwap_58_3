import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import '@/app/styles/global.css'
import { Textarea } from './Textarea'
import type { TextareaProps } from './interface'

function TextareaPreview(args: TextareaProps) {
  const [value, setValue] = useState(args.value)
  const [readOnly, setReadOnly] = useState(args.readOnly)

  return (
    <Textarea
      {...args}
      value={value}
      readOnly={readOnly}
      onChange={(event) => {
        setValue(event.target.value)
        args.onChange(event)
      }}
      onIconRightClick={() => {
        setReadOnly(false)
        args.onIconRightClick?.()
      }}
    />
  )
}

const meta = {
  title: 'Shared/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 460 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Описание',
    placeholder: 'Коротко опишите, чему можете научить',
    value: '',
    onChange: () => {},
    readOnly: false,
  },
  render: (args) => <TextareaPreview {...args} />,
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Обычное поле' }

export const WithError: Story = {
  name: 'С ошибкой',
  args: { error: 'Пожалуйста, добавьте описание' },
}

export const WithRightIcon: Story = {
  name: 'С иконкой редактирования',
  args: {
    label: 'О себе',
    value:
      'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
    rows: 4,
    iconRight: 'edit',
    readOnly: true,
  },
}

export const ReadOnly: Story = {
  name: 'Только для чтения',
  args: {
    label: 'О себе',
    value: 'Люблю учиться новому и делиться своими навыками.',
    readOnly: true,
  },
}
