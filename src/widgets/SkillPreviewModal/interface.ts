import type { CarouselImage } from '@/shared/ui/Carousel'

export interface SkillPreviewModalSkill {
  title: string
  /** Готовая строка, например «Творчество и искусство» */
  categoryName: string
  /** Готовая строка, например «Рисование и иллюстрации» */
  subcategoryName: string
  description: string
  images: CarouselImage[]
}

export interface SkillPreviewModalProps {
  isOpen: boolean
  skill: SkillPreviewModalSkill
  /** Вызывается по кнопке «Редактировать» */
  onEdit: () => void
  /** Вызывается по кнопке «Готово» */
  onConfirm: () => void
  onClose: () => void
  /** Текст ошибки, показывается над кнопками */
  error?: string
}
