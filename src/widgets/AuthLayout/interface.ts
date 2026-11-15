import type { ReactNode } from 'react'
import type { InfoProps } from '@/shared/ui/Info'

export interface AuthLayoutProps extends InfoProps {
  children: ReactNode
  currentStep?: number
  onClose?: () => void
}
