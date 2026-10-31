import { FC } from 'react'
import { ButtonProps } from './types'
import styles from './Button.module.css'

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  disabled = false,
  ...props
}) => {
  const buttonClassName = [styles.button, styles[variant], className].filter(Boolean).join(' ')

  return (
    <button type={type} className={buttonClassName} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

