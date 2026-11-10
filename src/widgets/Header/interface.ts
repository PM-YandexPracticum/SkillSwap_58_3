import type { ReactNode } from 'react'

export interface HeaderProps {
  isAuthorized: boolean
  name?: string
  avatarUrl?: string
  hasNewNotifications?: boolean
  searchValue: string
  onSearchChange: (value: string) => void
  onSearch?: () => void
  onLogin?: () => void
  onRegister?: () => void
  onLogout?: () => void
  notificationPanel?: ReactNode
  skillsMenu?: ReactNode
}
