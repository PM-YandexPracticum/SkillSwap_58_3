import { useId, useState } from 'react'
import styles from './Input.module.css'
import eyeIcon from '@/assets/eye.svg'
import { InputProps } from './types'
import clsx from 'clsx'

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

  const currentIconRight = type === 'password' ? eyeIcon : iconRight

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
        {iconLeft && <img className={styles.iconLeft} src={iconLeft} />}

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
          <img onClick={handleRightIconClick} className={styles.iconRight} src={currentIconRight} />
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
