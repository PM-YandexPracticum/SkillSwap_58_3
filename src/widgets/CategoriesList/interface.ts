import type { Category, SubcategoryId } from '@/shared/types'

export interface CategoriesListProps {
  categories: Category[]
  onSelectSubcategory?: (id: SubcategoryId) => void
}
