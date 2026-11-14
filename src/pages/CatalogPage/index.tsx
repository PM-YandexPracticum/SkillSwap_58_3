import { useEffect, useMemo, useState } from 'react'
import { fetchCategories } from '@/api/categories'
import { fetchCities } from '@/api/cities'
import { fetchSkills } from '@/api/skills'
import { fetchUsers } from '@/api/users'
import type { Category, City, Skill, User } from '@/shared/types'
import { Button } from '@/shared/ui/Button'
import { Icon } from '@/shared/ui/icons'
import { Loader } from '@/shared/ui/Loader'
import { Filters } from '@/widgets/Filters'
import { SkillsSection } from '@/widgets/SkillsSection'
import { mapUserToCardData } from '@/widgets/UserCard/mapUserToCardData'
import type { Dictionaries } from '@/widgets/UserCard/types'
import styles from './CatalogPage.module.css'

// количество карточек в секциях вынесено в именованные константы по требованию задачи
const POPULAR_SECTION_SIZE = 3
const NEW_SECTION_SIZE = 3
const RECOMMENDED_SECTION_SIZE = 9

// тип данных карточки: результат mapUserToCardData без null
type CardData = NonNullable<ReturnType<typeof mapUserToCardData>>

// Главная страница каталога: сайдбар фильтров и три секции карточек.

export default function CatalogPage() {
  const [users, setUsers] = useState<User[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

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
        if (isMounted) setHasError(true)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  // словари для преобразования пользователей в карточки
  const dictionaries: Dictionaries = useMemo(
    () => ({ skills, categories, cities }),
    [skills, categories, cities],
  )

  const cards = useMemo(
    () =>
      users
        .map((user) => mapUserToCardData(user, dictionaries))
        .filter((card): card is CardData => card !== null),
    [users, dictionaries],
  )

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={styles.status} role="alert">
        <p className={styles.error}>Не удалось загрузить каталог. Попробуйте обновить страницу.</p>
      </div>
    )
  }

  const cardById = new Map<string, CardData>(cards.map((card) => [card.id, card]))
  const toCards = (orderedUsers: User[]) =>
    orderedUsers
      .map((user) => cardById.get(user.id))
      .filter((card): card is CardData => card !== undefined)

  // Популярное — топ по лайкам, Новое — свежие по createdAt, Рекомендуем — остальные
  const popularCards = toCards([...users].sort((a, b) => b.likedCount - a.likedCount)).slice(
    0,
    POPULAR_SECTION_SIZE,
  )
  const popularIds = new Set(popularCards.map((card) => card.id))
  const newCards = toCards(
    [...users]
      .filter((user) => !popularIds.has(user.id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  ).slice(0, NEW_SECTION_SIZE)
  const takenIds = new Set([...popularIds, ...newCards.map((card) => card.id)])
  const recommendedCards = toCards(users.filter((user) => !takenIds.has(user.id))).slice(
    0,
    RECOMMENDED_SECTION_SIZE,
  )

  const seeAllAction = (
    <Button variant="outline" iconRight={<Icon name="chevron-right" size={16} />}>
      Смотреть все
    </Button>
  )

  return (
    <div className={styles.page}>
      {/* Filters подключаем как готовый блок по макету;
          связывание значений фильтров со списком карточек — отдельная задача */}
      <Filters />
      <div className={styles.content}>
        <SkillsSection title="Популярное" items={popularCards} actions={seeAllAction} />
        <SkillsSection title="Новое" items={newCards} actions={seeAllAction} />
        <SkillsSection title="Рекомендуем" items={recommendedCards} />
      </div>
    </div>
  )
}
