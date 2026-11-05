import { FilterChipProps } from './interface'
import styles from './FilterChip.module.css'
import { Icon } from '../icons'

export const FilterChip = ({ label, onRemove }: FilterChipProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>

      <button className={styles.button} type="button" onClick={onRemove} aria-label="Удалить">
        <Icon name="close" />
      </button>
    </div>
  )
}
