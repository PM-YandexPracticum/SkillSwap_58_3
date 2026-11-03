import { LikeButtonProps } from './interface'
import styles from './LikeButton.module.css'
//import likeSvg from '../../icon/'

export const LikeButton = ({ count = 0, isLiked, onClick }: LikeButtonProps) => {
  const renderCount = () => {
    if (count <= 0) return null
    if (count > 99) return '99+'
    return count
  }

  const countLabel = renderCount()

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.likeButton} ${isLiked ? styles.isLiked : ''}`}
      aria-label={`поставить лайк. Лайков: ${count}`}
    >
      <svg className={styles.heartIcon} width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      {countLabel && <span className={styles.likeCount}>{countLabel}</span>}
    </button>
  )
}
