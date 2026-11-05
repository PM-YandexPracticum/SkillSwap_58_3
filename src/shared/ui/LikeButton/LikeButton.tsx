import { LikeButtonProps } from './interface'
import styles from './LikeButton.module.css'
import clsx from 'clsx'

export const LikeButton = ({ count = 0, isLiked, onClick }: LikeButtonProps) => {
  const renderCount = () => {
    if (count <= 0) return null
    if (count > 99) return '99+'
    return count
  }

  const countLabel = renderCount()

  const iconId = isLiked ? 'heart-filled' : 'heart'

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(styles.likeButton, { [styles.isLiked]: isLiked })}
      aria-label={`поставить лайк. Лайков: ${count}`}
    >
      <svg className={styles.heartIcon} width="24" height="24">
        <use href={`/icons/sprite.svg#${iconId}`} />
      </svg>
      {countLabel && <span className={styles.likeCount}>{countLabel}</span>}
    </button>
  )
}
