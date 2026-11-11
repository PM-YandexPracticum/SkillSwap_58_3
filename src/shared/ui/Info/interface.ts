import type { IconName } from '../icons'

export interface InfoProps {
  image: IconName
  variant: 'registration' | 'error'
  title: string
  description: string
  alt: string
  className?: string
}
