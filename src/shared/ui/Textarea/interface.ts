import type { ChangeEvent } from 'react'
import type { IconName } from '../icons'

export interface TextareaProps {
  label: string
  placeholder?: string
  value: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
  rows?: number
  maxLength?: number
  iconRight?: IconName
  readOnly?: boolean
  onIconRightClick?: () => void
}
