import type { Skill, User } from '@/shared/types'

export type SkillCardAction = 'like' | 'exchange'

export interface SkillCardProps {
  skill: Skill
  author: Pick<User, 'id' | 'name'>
  categoryName: string
  subcategoryName: string
  /** Если задан, статусом обмена управляет родитель. Иначе кнопка обновляется локально. */
  isExchanged?: boolean
  isLiked?: boolean
  isOwnSkill?: boolean
  onAction: (action: SkillCardAction) => void
  className?: string
}
