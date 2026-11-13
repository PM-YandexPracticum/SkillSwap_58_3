import type { ReactNode } from 'react'

export interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
  illustrationSrc: string
  currentStep?: number
  onClose?: () => void
}
