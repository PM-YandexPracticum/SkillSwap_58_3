import { useId } from 'react'
import clsx from 'clsx'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { LikeButton } from '@/shared/ui/LikeButton'
import { formatAge } from './formatAge'
import { SkillGroup } from './SkillGroup'
import type { UserCardProps } from './interface'
import styles from './UserCard.module.css'

export const UserCard = ({
  variant,
  name,
  avatarUrl,
  city,
  age,
  description,
  teach,
  learn,
  isLiked = false,
  onLike,
  onDetails,
}: UserCardProps) => {
  const nameId = useId()
  const isCatalog = variant === 'catalog'
  const titleSuffix = isCatalog ? ':' : ''

  return (
    <article className={clsx(styles.card, styles[variant])} aria-labelledby={nameId}>
      {isCatalog && (
        <div className={styles.like}>
          <LikeButton isLiked={isLiked} onClick={() => onLike?.()} />
        </div>
      )}

      <header className={styles.header}>
        <Avatar size="large" src={avatarUrl ?? undefined} />
        <div className={styles.about}>
          <h3 className={styles.name} id={nameId}>
            {name}
          </h3>
          <p className={styles.meta}>
            {city}, {formatAge(age)}
          </p>
        </div>
      </header>

      {!isCatalog && description && <p className={styles.description}>{description}</p>}

      <div className={styles.skills}>
        <SkillGroup title={`Может научить${titleSuffix}`} skills={teach} />
        <SkillGroup title={`Хочет научиться${titleSuffix}`} skills={learn} />
      </div>

      {isCatalog && (
        <Button className={styles.details} onClick={onDetails}>
          Подробнее
        </Button>
      )}
    </article>
  )
}
