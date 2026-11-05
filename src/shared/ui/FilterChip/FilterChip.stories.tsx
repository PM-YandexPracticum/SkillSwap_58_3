import { FilterChip } from './FilterChip'

export default {
  title: 'Shared/FilterChip',
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
    onRemove: () => {},
  },
}
