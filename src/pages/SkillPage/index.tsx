import { useEffect, useState } from 'react'
import { generatePath, Link, useNavigate, useParams } from 'react-router-dom'
import { fetchSkillById, fetchSkills } from '@/api/skills'
import { fetchUserById, fetchUsers } from '@/api/users'
import { fetchCities } from '@/api/cities'
import { fetchCategories } from '@/api/categories'
import { ROUTES } from '@/shared/lib/constants'
import type { Category, City, Skill, User } from '@/shared/types'
import { Loader } from '@/shared/ui/Loader'
import { SkillCard } from '@/widgets/SkillCard'
import { SkillsSection } from '@/widgets/SkillsSection'
import { UserCard } from '@/widgets/UserCard'
import { mapUserToCardData } from '@/widgets/UserCard/mapUserToCardData'
import { selectSimilarSkills } from './selectSimilarSkills'
import styles from './SkillPage.module.css'

interface SkillPageData {
  skill: Skill
  author: User
  skills: Skill[]
  users: User[]
  cities: City[]
  categories: Category[]
}

type PageState = { id: string | undefined } & (
  { status: 'loading' | 'error' | 'notFound' } | { status: 'ready'; data: SkillPageData }
)

export default function SkillPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [state, setState] = useState<PageState>({ id, status: 'loading' })
  const [likedAuthorIds, setLikedAuthorIds] = useState<string[]>([])

  useEffect(() => {
    let active = true
    setState({ id, status: 'loading' })

    async function loadSkill() {
      try {
        const skill = id ? await fetchSkillById(id) : undefined
        if (!active) return
        if (!skill) {
          setState({ id, status: 'notFound' })
          return
        }

        const [author, skills, users, cities, categories] = await Promise.all([
          fetchUserById(skill.authorId),
          fetchSkills(),
          fetchUsers(),
          fetchCities(),
          fetchCategories(),
        ])
        if (!active) return
        setState(
          author
            ? { id, status: 'ready', data: { skill, author, skills, users, cities, categories } }
            : { id, status: 'notFound' },
        )
      } catch {
        if (active) setState({ id, status: 'error' })
      }
    }

    void loadSkill()
    return () => {
      active = false
    }
  }, [id])

  function toggleLike(authorId: string) {
    setLikedAuthorIds((ids) =>
      ids.includes(authorId) ? ids.filter((value) => value !== authorId) : [...ids, authorId],
    )
  }

  if (state.id !== id || state.status === 'loading') {
    return (
      <div className={styles.status}>
        <Loader />
      </div>
    )
  }

  if (state.status !== 'ready') {
    return (
      <section className={styles.status}>
        <h1>{state.status === 'error' ? 'Не удалось загрузить навык' : 'Навык не найден'}</h1>
        <Link className={styles.homeLink} to={ROUTES.HOME}>
          На главную
        </Link>
      </section>
    )
  }

  const { skill, author, skills, users, cities, categories } = state.data
  const dictionaries = { skills, cities, categories }
  const authorCard = mapUserToCardData(author, dictionaries)
  const category = categories.find((item) => item.id === skill.category)
  const subcategory = category?.subcategories.find((item) => item.id === skill.subcategory)
  const similarItems = selectSimilarSkills(skill, skills, users).flatMap((similarSkill) => {
    const user = users.find((item) => item.id === similarSkill.authorId)
    const card = user && mapUserToCardData(user, dictionaries)
    return card
      ? [
          {
            ...card,
            isLiked: likedAuthorIds.includes(card.id),
            onLike: () => toggleLike(card.id),
            onDetails: () => navigate(generatePath(ROUTES.SKILL, { id: similarSkill.id })),
          },
        ]
      : []
  })

  return (
    <div className={styles.page}>
      <section className={styles.details} aria-label="Навык и его автор">
        <div className={styles.author}>
          {authorCard && <UserCard {...authorCard} variant="preview" />}
        </div>
        <SkillCard
          skill={skill}
          author={author}
          categoryName={category?.name ?? ''}
          subcategoryName={subcategory?.name ?? ''}
          isLiked={likedAuthorIds.includes(author.id)}
          onAction={(action) => {
            if (action === 'like') toggleLike(author.id)
          }}
        />
      </section>
      <SkillsSection title="Похожие предложения" items={similarItems} columns={4} />
    </div>
  )
}
