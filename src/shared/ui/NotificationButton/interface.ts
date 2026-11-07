import type { MouseEvent } from 'react'

export interface NotificationButtonProps {
  hasNew?: boolean
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}
