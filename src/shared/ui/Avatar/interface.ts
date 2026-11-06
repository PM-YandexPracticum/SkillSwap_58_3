export type AvatarSize = 'small' | 'medium' | 'large' | 'extraLarge'

export type AvatarEditAction = 'edit' | 'delete'

export interface AvatarProps {
  size?: AvatarSize
  src?: string
  alt?: string
  onAdd?: () => void
  /** Вызывается после выбора «Изменить» или «Удалить» в меню фотографии. */
  onEdit?: (action: AvatarEditAction) => void
}
