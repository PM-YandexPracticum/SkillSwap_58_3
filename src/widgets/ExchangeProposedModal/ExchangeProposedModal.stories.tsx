import { Meta, StoryObj } from '@storybook/react-vite'
import { ExchangeProposedModal } from './ExchangeProposedModal'

const meta: Meta<typeof ExchangeProposedModal> = {
  title: 'Widgets/ExchangeProposedModal',
  component: ExchangeProposedModal,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'modal closed' },
  },
}
export default meta
export type Story = StoryObj<typeof ExchangeProposedModal>

export const Default: Story = {
  args: {
    isOpen: true,
  },
}
