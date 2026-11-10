import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio } from './Radio'

const meta = {
  title: 'Shared/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: {
    label: 'Хочу научиться',
    name: 'radio-example',
    value: 'learn',
    checked: false,
    onChange: () => {},
  },
} satisfies Meta<typeof Radio>

export default meta

type Story = StoryObj<typeof meta>

export const Unchecked: Story = {}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = useState('all')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Radio
          label="Всё"
          name="skill-filter"
          value="all"
          checked={selected === 'all'}
          onChange={setSelected}
        />
        <Radio
          label="Хочу научиться"
          name="skill-filter"
          value="learn"
          checked={selected === 'learn'}
          onChange={setSelected}
        />
        <Radio
          label="Могу научить"
          name="skill-filter"
          value="teach"
          checked={selected === 'teach'}
          onChange={setSelected}
        />
      </div>
    )
  },
}
