import { useId } from 'react'
import { Tag } from '@/shared/ui/Tag'
import type { UserCardSkill } from './interface'
import styles from './UserCard.module.css'

const MAX_VISIBLE_TAGS = 2

interface SkillGroupProps {
  title: string
  skills: UserCardSkill[]
}

export const SkillGroup = ({ title, skills }: SkillGroupProps) => {
  const titleId = useId()

  if (skills.length === 0) return null

  const visibleSkills = skills.slice(0, MAX_VISIBLE_TAGS)
  const hiddenCount = skills.length - visibleSkills.length

  return (
    <div className={styles.group}>
      <h4 className={styles.groupTitle} id={titleId}>
        {title}
      </h4>
      <ul className={styles.tags} aria-labelledby={titleId}>
        {visibleSkills.map(({ id, label, categoryId }) => (
          <li key={id}>
            <Tag label={label} categoryId={categoryId} />
          </li>
        ))}
        {hiddenCount > 0 && (
          <li aria-label={`и ещё ${hiddenCount}`}>
            <Tag label={`+${hiddenCount}`} isMore />
          </li>
        )}
      </ul>
    </div>
  )
}
