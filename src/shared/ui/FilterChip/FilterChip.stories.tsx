import { FilterChip } from './FilterChip'

export default {
  title: 'Components/FilterChip',
  component: FilterChip,
}

export const Default = {
  args: {
    label: 'Hello',
  },
}

export const WithIcon = {
  args: {
    label: 'Hello',
    onRemove: () => {
      console.log('call')
    },
  },
}
