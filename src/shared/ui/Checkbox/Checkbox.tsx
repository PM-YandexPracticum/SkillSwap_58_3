import { useEffect, useRef, type FC, type ChangeEvent } from 'react'
import clsx from 'clsx'
import type { CheckboxProps } from '@/shared/types'
import styles from './Checkbox.module.css'

export const Checkbox: FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  indeterminate = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  const boxClasses = clsx(styles.box, (checked || indeterminate) && styles.boxChecked)

  return (
    <label className={styles.container}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={styles.input}
      />
      <span className={boxClasses}>
        {indeterminate ? (
          <svg width="10" height="2" fill="none">
            <use href="/icons/sprite.svg#dash" />
          </svg>
        ) : checked ? (
          <svg width="12" height="10" fill="none">
            <use href="/icons/sprite.svg#check" />
          </svg>
        ) : null}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
