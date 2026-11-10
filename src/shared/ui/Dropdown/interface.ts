import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react'

export interface DropdownProps {
  /** Кнопка или компонент, пробрасывающий HTML-атрибуты на кнопку. */
  trigger: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  panelClassName?: string
  ariaLabel?: string
}
