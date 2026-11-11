import { forwardRef } from 'react'
import clsx from 'clsx'
import { ButtonProps } from './types'
import styles from './Button.module.css'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      className,
      children,
      type = 'button',
      disabled = false,
      iconLeft,
      iconRight,
      ...props
    },
    ref,
  ) => {
    const buttonClassName = clsx(styles.button, styles[variant], className)

    return (
      <button ref={ref} type={type} className={buttonClassName} disabled={disabled} {...props}>
        {iconLeft}
        {children}
        {iconRight}
      </button>
    )
  },
)

Button.displayName = 'Button'
