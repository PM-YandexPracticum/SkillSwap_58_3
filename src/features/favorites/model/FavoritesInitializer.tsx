import { useEffect } from 'react'
import { fetchUsers } from '@/api/users'
import { useAppDispatch } from '@/store/hooks'
import { initializeFavorites } from './favoritesSlice'

export function FavoritesInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let isMounted = true

    fetchUsers()
      .then((users) => {
        if (!isMounted) return

        users.forEach((user) => {
          dispatch(
            initializeFavorites({
              userId: user.id,
              favoriteIds: user.favourites,
            }),
          )
        })
      })
      .catch((error: unknown) => {
        console.error('Не удалось загрузить избранное:', error)
      })

    return () => {
      isMounted = false
    }
  }, [dispatch])

  return null
}
