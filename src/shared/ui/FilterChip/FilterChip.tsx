import { FilterChipProps } from './interface'
import styles from './FilterChip.module.css'
import closeIcon from '@/assets/cross.svg'
import clsx from 'clsx'

export const FilterChip = ({ label, onRemove, className }: FilterChipProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      <span className={styles.label}>{label}</span>

      <button type="button" onClick={onRemove} aria-label="Удалить">
        <img className={styles.icon} src={closeIcon} />
      </button>
    </div>
  )
}
