import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { ROUTES } from '@/shared/lib/constants'
import { selectFavoriteIds, toggleFavorite } from './favoritesSlice'

export function useFavorites() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const favoriteIds = useAppSelector(selectFavoriteIds)

  const isFavorite = (id: string) => favoriteIds.includes(id)

  const toggle = (id: string) => {
    if (!user) {
      navigate(ROUTES.LOGIN)
      return
    }

    dispatch(toggleFavorite({ userId: user.id, favoriteId: id }))
  }

  return { favoriteIds, isFavorite, toggle }
}
