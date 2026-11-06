import type { Meta, StoryObj } from '@storybook/react-vite'
import { LikeButton } from './LikeButton'

const meta: Meta<typeof LikeButton> = {
  title: 'Shared/LikeButton',
  component: LikeButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
}

export default meta

type Story = StoryObj<typeof LikeButton>

export const Default: Story = {
  args: {
    isLiked: false,
    count: 0,
  },
}

export const LikeActive: Story = {
  args: {
    isLiked: true,
    count: 5,
  },
}

export const ManyLikes: Story = {
  args: {
    isLiked: false,
    count: 569,
  },
}
