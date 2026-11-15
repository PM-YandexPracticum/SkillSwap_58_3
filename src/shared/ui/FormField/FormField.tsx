import clsx from 'clsx'
import type { FormFieldProps } from './interface'
import styles from './FormField.module.css'

export const FormField = ({ id, label, children, className, hint, error }: FormFieldProps) => {
  return (
    <div className={clsx(styles.field, className)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <span id={id ? `${id}-error` : undefined} className={styles.error}>
          {error}
        </span>
      ) : (
        hint && (
          <span id={id ? `${id}-hint` : undefined} className={styles.hint}>
            {hint}
          </span>
        )
      )}
    </div>
  )
}
