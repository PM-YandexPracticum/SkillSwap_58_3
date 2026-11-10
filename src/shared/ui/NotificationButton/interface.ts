import type { ButtonHTMLAttributes, MouseEvent } from 'react'

export interface NotificationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hasNew?: boolean
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}
