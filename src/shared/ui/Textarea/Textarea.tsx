import { useId } from 'react'
import clsx from 'clsx'
import { Icon } from '../icons'
import type { TextareaProps } from './interface'
import styles from './Textarea.module.css'

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  rows = 3,
  maxLength = 500,
  iconRight,
  readOnly = false,
  disabled = false,
  onIconRightClick,
}: TextareaProps) {
  const id = useId()

  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={styles.field}>
        <textarea
          id={id}
          className={clsx(styles.textarea, {
            [styles.error]: error,
            [styles.withIcon]: iconRight,
          })}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          maxLength={maxLength}
          readOnly={readOnly}
          disabled={disabled}
          aria-label={label ? undefined : placeholder || 'Текстовое поле'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {iconRight && (
          <button
            className={styles.iconButton}
            type="button"
            aria-label={label ? `Редактировать: ${label}` : 'Редактировать'}
            disabled={disabled}
            onClick={onIconRightClick}
          >
            <Icon name={iconRight} />
          </button>
        )}
      </div>
      {error && (
        <span id={`${id}-error`} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  )
}
