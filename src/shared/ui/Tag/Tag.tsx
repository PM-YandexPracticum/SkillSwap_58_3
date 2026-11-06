import { FC } from 'react'
import clsx from 'clsx'
import { TagProps } from './interface'
import styles from './Tag.module.css'

export const Tag: FC<TagProps> = ({ label, categoryId, isMore = false, onRemove }) => {
  const categoryClass = isMore ? styles.more : categoryId ? styles[categoryId] : ''

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
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.removeIcon}
          >
            <path
              d="M1 1L9 9M9 1L1 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  )
}
