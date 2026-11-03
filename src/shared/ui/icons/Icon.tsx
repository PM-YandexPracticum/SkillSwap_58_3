import type { SVGProps } from 'react'

export type IconName =
  | 'apple'
  | 'bell'
  | 'bulb'
  | 'calendar'
  | 'category-art'
  | 'category-business'
  | 'category-education'
  | 'category-health'
  | 'category-home'
  | 'category-languages'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-up'
  | 'clock'
  | 'close'
  | 'done'
  | 'edit'
  | 'gallery-add'
  | 'gallery-edit'
  | 'google'
  | 'heart'
  | 'heart-filled'
  | 'logout'
  | 'message-text'
  | 'moon'
  | 'more'
  | 'plus'
  | 'plus-circle'
  | 'request'
  | 'search'
  | 'share'
  | 'sort'
  | 'user'
  | 'user-circle'
  | 'view-password'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

// иконка из спрайта public/icons/sprite.svg;
// цвет наследуется через currentColor */
export function Icon({ name, size = 24, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} aria-hidden="true" {...rest}>
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  )
}
