import type { CSSProperties, ReactNode } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  children: ReactNode
  ariaLabelledBy?: string
  ariaLabel?: string
}
