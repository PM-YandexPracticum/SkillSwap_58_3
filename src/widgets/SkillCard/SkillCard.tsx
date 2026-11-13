import { useState } from 'react'
import clsx from 'clsx'
import { Button } from '@/shared/ui/Button'
import { Carousel } from '@/shared/ui/Carousel'
import { LikeButton } from '@/shared/ui/LikeButton'
import { Icon } from '@/shared/ui/icons'
import type { SkillCardProps } from './interface'
import styles from './SkillCard.module.css'

export function SkillCard({
  skill,
  author,
  categoryName,
  subcategoryName,
  isExchanged,
  isLiked = false,
  onAction,
  className,
}: SkillCardProps) {
  const [requestedSkillId, setRequestedSkillId] = useState<string | null>(null)
  const exchangeProposed = isExchanged ?? requestedSkillId === skill.id
  const images = skill.images.map((src, index) => ({
    id: `${skill.id}-${index}`,
    src,
    alt: `${skill.title}. Автор: ${author.name}. Фото ${index + 1}`,
  }))

  function handleExchange() {
    if (exchangeProposed) return
    setRequestedSkillId(skill.id)
    onAction('exchange')
  }

  return (
    <article
      className={clsx(styles.card, className)}
      aria-label={`${skill.title}. Автор: ${author.name}`}
    >
      <div className={styles.actions} role="group" aria-label="Действия с навыком">
        <LikeButton isLiked={isLiked} onClick={() => onAction('like')} />
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Поделиться навыком"
          disabled
        >
          <Icon name="share" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Дополнительные действия"
          disabled
        >
          <Icon name="more" />
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h2 className={styles.title}>{skill.title}</h2>
            <p className={styles.category}>
              {categoryName} / {subcategoryName}
            </p>
          </header>
          <p className={styles.description}>{skill.description}</p>
          <Button
            className={styles.exchangeButton}
            variant={exchangeProposed ? 'outline' : 'primary'}
            iconLeft={exchangeProposed ? <Icon name="clock" /> : undefined}
            disabled={exchangeProposed}
            onClick={handleExchange}
          >
            {exchangeProposed ? 'Обмен предложен' : 'Предложить обмен'}
          </Button>
        </div>
        <Carousel className={styles.gallery} images={images} />
      </div>
    </article>
  )
}
