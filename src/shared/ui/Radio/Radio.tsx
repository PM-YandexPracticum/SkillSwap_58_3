import type { ChangeEvent } from 'react'
import clsx from 'clsx'
import type { RadioProps } from './interface'
import styles from './Radio.module.css'

export const Radio = ({ label, name, value, checked, onChange }: RadioProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onChange(value)
    }
  }

  return (
    <label className={styles.container}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        className={styles.input}
      />

      <span className={clsx(styles.circle, checked && styles.circleChecked)} aria-hidden="true">
        <span className={styles.dot} />
      </span>

      <span className={styles.label}>{label}</span>
    </label>
  )
}
