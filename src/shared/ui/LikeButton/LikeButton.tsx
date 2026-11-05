import { LikeButtonProps } from './interface'
import styles from './LikeButton.module.css'
import clsx from 'clsx'
import { Icon } from '../icons'

export const LikeButton = ({ count = 0, isLiked, onClick }: LikeButtonProps) => {
  const renderCount = () => {
    if (count <= 0) return null
    if (count > 99) return '99+'
    return count
  }

  const countLabel = renderCount()

  const iconName = isLiked ? 'heart-filled' : 'heart'

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(styles.likeButton, { [styles.isLiked]: isLiked })}
      aria-label={!isLiked ? `поставить лайк. Лайков: ${count}` : 'убрать лайк'}
    >
      <Icon name={iconName} className={styles.heartIcon} />
      {countLabel && <span className={styles.likeCount}>{countLabel}</span>}
    </button>
  )
}
