import { NotificationItem } from '@/shared/types'
import { MouseEvent } from 'react'

export interface NotificationPanelProps {
  newItems: NotificationItem[]
  viewedItems: NotificationItem[]
  onGo: (e: MouseEvent<HTMLButtonElement>) => void
  onReadAll: (e: MouseEvent<HTMLButtonElement>) => void
  onClear: (e: MouseEvent<HTMLButtonElement>) => void
}
