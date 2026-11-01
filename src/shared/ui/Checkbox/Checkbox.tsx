import {
  useId,
  useRef,
  useEffect,
  useState,
  type FC,
  type ChangeEvent,
} from 'react'
import type { CheckboxProps } from '@/shared/types'
import styles from './Checkbox.module.css'

export const Checkbox: FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  indeterminate = false,
  disabled = false,
  className,
  id,
  name,
}) => {
  const generatedId = useId()
  const inputId = id || generatedId
  const inputRef = useRef<HTMLInputElement>(null)

  const isControlled = checked !== undefined
  const [internalChecked, setInternalChecked] = useState(false)
  const isChecked = isControlled ? checked : internalChecked

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate)
    }
  }, [indeterminate])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    if (!isControlled) {
      setInternalChecked(e.target.checked)
    }
    onChange?.(e.target.checked)
  }

  const containerClasses = [
    styles.container,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const boxClasses = [
    styles.box,
    (isChecked || indeterminate) && styles.boxChecked,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={containerClasses} htmlFor={inputId}>
      <input
        ref={inputRef}
        id={inputId}
        type="checkbox"
        name={name}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        className={styles.input}
      />
      <span className={boxClasses}>
        {indeterminate ? (
          <svg
            width="10"
            height="2"
            viewBox="0 0 10 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1H9"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : isChecked ? (
          <svg
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}

