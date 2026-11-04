import { useEffect, useRef, type FC, type ChangeEvent } from 'react'
import type { CheckboxProps } from '@/shared/types'
import { CheckIcon, DashIcon } from './icons'
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

  const boxClasses = `${styles.box} ${checked || indeterminate ? styles.boxChecked : ''}`

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
        {indeterminate ? <DashIcon /> : checked ? <CheckIcon /> : null}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
