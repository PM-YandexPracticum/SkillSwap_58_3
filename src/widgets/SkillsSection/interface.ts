import type { ReactNode } from 'react'
import type { UserCardProps } from '../UserCard/interface'

export type SkillsSectionItem = Omit<UserCardProps, 'variant'> & {
  id: string
}

export interface SkillsSectionProps {
  title: string
  items: SkillsSectionItem[]
  actions?: ReactNode
}
