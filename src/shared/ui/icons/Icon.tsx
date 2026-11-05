import type { IconProps } from './types'

// иконка из спрайта public/icons/sprite.svg;
// цвет наследуется через currentColor
export function Icon({ name, size = 24, 'aria-hidden': ariaHidden = true, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} aria-hidden={ariaHidden} {...rest}>
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  )
}
