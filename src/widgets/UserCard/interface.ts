import type { CategoryId } from '@/shared/types'

export type UserCardVariant = 'catalog' | 'preview'

export interface UserCardSkill {
  id: string
  label: string
  categoryId: CategoryId
}

export interface UserCardProps {
  variant: UserCardVariant
  name: string
  /** Без ссылки показывается заглушка */
  avatarUrl?: string | null
  city: string
  age: number
  /** Только для variant="preview" */
  description?: string
  /** Навыки «Может научить» */
  teach: UserCardSkill[]
  /** Навыки «Хочет научиться» */
  learn: UserCardSkill[]
  /** Только для variant="catalog" */
  isLiked?: boolean
  /** Только для variant="catalog" */
  onLike?: () => void
  /** Только для variant="catalog" */
  isExchangeProposed?: boolean
  /** Вызывается по кнопке «Подробнее», только для variant="catalog" */
  onDetails?: () => void
}
