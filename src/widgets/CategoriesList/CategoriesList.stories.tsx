import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import categories from '../../../public/db/categories.json'
import { CategoriesList } from './CategoriesList'

const meta = {
  title: 'Widgets/CategoriesList',
  component: CategoriesList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    categories,
    onSelectSubcategory: fn(),
  },
} satisfies Meta<typeof CategoriesList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutHandler: Story = {
  args: {
    onSelectSubcategory: undefined,
  },
}

export const Empty: Story = {
  args: {
    categories: [],
  },
}
