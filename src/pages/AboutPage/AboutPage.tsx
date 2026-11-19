import { useEffect, useState } from 'react'
import { fetchTeam } from '@/api/team'
import { Loader } from '@/shared/ui/Loader'
import { TeamMemberCard } from '@/widgets/TeamMemberCard'
import type { TeamMemberCardProps } from '@/widgets/TeamMemberCard'
import styles from './AboutPage.module.css'

/**
 * Страница «О проекте»: карточки участников команды из team.json.
 * Header и Footer не рисуем — их отдаёт MainLayout.
 */
export default function AboutPage() {
  const [team, setTeam] = useState<TeamMemberCardProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true
    fetchTeam()
      .then((teamData) => {
        if (isMounted) setTeam(teamData)
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
        <p className={styles.error}>Не удалось загрузить команду. Попробуйте обновить страницу.</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Команда разработчиков SkillSwap</h1>
      <div className={styles.grid}>
        {team.map((member) => (
          <TeamMemberCard key={member.id} {...member} />
        ))}
      </div>
    </div>
  )
}
