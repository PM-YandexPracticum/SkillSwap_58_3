import { NotificationItem } from '@/shared/types'
import { MouseEvent } from 'react'

export interface NotificationPanelProps {
  newItems: NotificationItem[]
  viewedItems: NotificationItem[]
  onGo: (id: string) => void
  onReadAll: (e: MouseEvent<HTMLButtonElement>) => void
  onClear: (e: MouseEvent<HTMLButtonElement>) => void
}

export interface NotificationSectionProps {
  items: NotificationItem[]
  heading: string
  onButtonClick: (e: MouseEvent<HTMLButtonElement>) => void
  onGo?: (id: string) => void
  buttonName: 'Прочитать все' | 'Очистить'
}
