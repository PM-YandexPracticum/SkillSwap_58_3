import clsx from 'clsx'
import type { CategoryId } from '@/shared/types'
import { Icon } from '../icons'
import { TagProps } from './interface'
import styles from './Tag.module.css'

const CATEGORY_CLASS_MAP: Record<CategoryId, string> = {
  business: styles.business,
  languages: styles.languages,
  home: styles.home,
  creativity: styles.creativity,
  education: styles.education,
  health: styles.health,
}

export const Tag = ({ label, categoryId, isMore = false, onRemove }: TagProps) => {
  const categoryClass = isMore ? styles.more : categoryId ? CATEGORY_CLASS_MAP[categoryId] : ''

  return (
    <span className={clsx(styles.tag, categoryClass)}>
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={styles.removeButton}
          aria-label="Удалить"
        >
          <Icon name="close" size={10} />
        </button>
      )}
    </span>
  )
}
