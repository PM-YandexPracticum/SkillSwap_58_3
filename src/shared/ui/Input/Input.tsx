import { useId, useState } from 'react'
import styles from './Input.module.css'
import { InputProps } from './types'
import clsx from 'clsx'
import { Icon } from '../icons'

export const Input = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  hint,
  iconLeft,
  iconRight,
  readOnly = false,
  onRightIconClick,
}: InputProps) => {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false)

  const currentIconRight = type === 'password' ? 'view-password' : iconRight

  const handleRightIconClick = () => {
    if (type === 'password') {
      setIsVisiblePassword((prev) => !prev)
    }

    if (onRightIconClick) {
      onRightIconClick()
    }
  }

  const getCurrentInputType = () => {
    if (type === 'password') {
      return isVisiblePassword ? 'text' : 'password'
    } else {
      return type
    }
  }

  const generatedId = useId()
  const genId = id ?? generatedId

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label} htmlFor={genId}>
          {label}
        </label>
      )}

      <div className={styles.iconsContainerInput}>
        {iconLeft && <Icon className={styles.iconLeft} name={iconLeft} />}

        <input
          id={genId}
          className={clsx(styles.input, {
            [styles.error]: error,
            [styles.additionalValueStyles]: iconLeft,
          })}
          type={getCurrentInputType()}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
        />
        {currentIconRight && (
          <button
            className={styles.buttonIconRight}
            type="button"
            aria-label="Правая иконка"
            onClick={handleRightIconClick}
          >
            <Icon name={currentIconRight} />
          </button>
        )}
      </div>

      {error ? (
        <span id={`error-${genId}`} className={styles.errorText}>
          {error}
        </span>
      ) : (
        hint && (
          <span id={`hint-${genId}`} className={styles.inputHint}>
            {hint}
          </span>
        )
      )}
    </div>
  )
}
