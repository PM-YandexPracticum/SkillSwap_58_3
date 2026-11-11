import type { SVGProps } from 'react'

// имена иконок из спрайта public/icons/sprite.svg
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
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'clock'
  | 'close'
  | 'done'
  | 'edit'
  | 'error-404'
  | 'error-500'
  | 'gallery-add'
  | 'gallery-edit'
  | 'google'
  | 'heart'
  | 'heart-filled'
  | 'light-bulb'
  | 'logo'
  | 'logout'
  | 'message-text'
  | 'moon'
  | 'more'
  | 'plus'
  | 'plus-circle'
  | 'request'
  | 'school-board'
  | 'search'
  | 'share'
  | 'sort'
  | 'user'
  | 'user-circle'
  | 'user-info'
  | 'view-password'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
  className?: string
  'aria-hidden'?: boolean
}
