import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProfileMenu } from './ProfileMenu'

const meta: Meta<typeof ProfileMenu> = {
  title: 'Widgets/ProfileMenu',
  component: ProfileMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSelect: () => {},
  },
}

export default meta
type Story = StoryObj<typeof ProfileMenu>

export const RequestsActive: Story = {
  args: {
    activeItem: 'requests',
  },
}

export const ExchangesActive: Story = {
  args: {
    activeItem: 'exchanges',
  },
}

export const FavoritesActive: Story = {
  args: {
    activeItem: 'favorites',
  },
}

export const SkillsActive: Story = {
  args: {
    activeItem: 'skills',
  },
}

export const PersonalActive: Story = {
  args: {
    activeItem: 'personal',
  },
}
