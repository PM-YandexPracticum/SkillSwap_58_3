import { FC } from 'react'
import clsx from 'clsx'
import { ButtonProps } from './types'
import styles from './Button.module.css'

export const Button: FC<ButtonProps> = ({
  variant,
  className,
  children,
  type = 'button',
  disabled = false,
  ...props
}) => {
  const buttonClassName = clsx(styles.button, styles[variant], className)

  return (
    <button type={type} className={buttonClassName} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

