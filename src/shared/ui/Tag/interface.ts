import type { CategoryId } from '@/shared/types'

export interface TagProps {
  label: string
  categoryId?: CategoryId
  isMore?: boolean
  onRemove?: () => void
}
