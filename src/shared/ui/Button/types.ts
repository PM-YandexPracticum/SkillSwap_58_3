import { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'outline'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  className?: string
  children: ReactNode
  iconLeft?: ReactNode
  iconRight?: ReactNode
}
