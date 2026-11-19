import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCategories } from '@/api/categories'
import { fetchCities } from '@/api/cities'
import { fetchSkills } from '@/api/skills'
import { fetchUsers } from '@/api/users'
import { useFavorites } from '@/features/favorites/model/useFavorites'
import { selectProposedUserIds } from '@/features/exchange/model/exchangeSlice'
import { ROUTES } from '@/shared/lib/constants'
import type { Category, City, Skill, User } from '@/shared/types'
import { Button } from '@/shared/ui/Button'
import { Loader } from '@/shared/ui/Loader'
import { useAppSelector } from '@/store/hooks'
import { Filters } from '@/widgets/Filters'
import { SkillsSection } from '@/widgets/SkillsSection'
import type { SkillsSectionItem } from '@/widgets/SkillsSection'
import { mapUserToCardData } from '@/widgets/UserCard/mapUserToCardData'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const { favoriteIds, toggle } = useFavorites()
  const proposedUserIds = useAppSelector(selectProposedUserIds)

  useEffect(() => {
    let isMounted = true

    Promise.all([fetchUsers(), fetchSkills(), fetchCategories(), fetchCities()])
      .then(([usersData, skillsData, categoriesData, citiesData]) => {
        if (!isMounted) return

        setUsers(usersData)
        setSkills(skillsData)
        setCategories(categoriesData)
        setCities(citiesData)
      })
      .catch(() => {
        if (isMounted) setError(true)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const favoriteUsers = users.filter((user) => favoriteIds.includes(user.id))

  const favoriteCards: SkillsSectionItem[] = favoriteUsers.flatMap((user) => {
    const card = mapUserToCardData(user, { skills, categories, cities })

    return card
      ? [
          {
            ...card,
            isLiked: true,
            isExchangeProposed: proposedUserIds.includes(card.id),
            onLike: () => toggle(user.id),
          },
        ]
      : []
  })

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    )
  }

  if (error) {
    return <p>Не удалось загрузить избранное. Попробуйте обновить страницу.</p>
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <Filters />
        </aside>

        <div className={styles.results}>
          {favoriteCards.length > 0 ? (
            <SkillsSection title="Избранное" items={favoriteCards} />
          ) : (
            <section className={styles.empty}>
              <h1>Избранное</h1>
              <p>В избранном пока ничего нет</p>
              <Button onClick={() => navigate(ROUTES.HOME)}>Вернуться в каталог</Button>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
