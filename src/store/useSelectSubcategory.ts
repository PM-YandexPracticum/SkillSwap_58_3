import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import type { SubcategoryId } from '@/shared/types'
import { useAppDispatch } from './hooks'
import { filterBySubcategory } from './slices/filtersSlice'

// выбор подкатегории из списка навыков: включает фильтр и ведёт на главную
export function useSelectSubcategory(onSelect?: () => void) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (subcategoryId: SubcategoryId) => {
    dispatch(filterBySubcategory(subcategoryId))
    navigate(ROUTES.HOME)
    onSelect?.()
  }
}
