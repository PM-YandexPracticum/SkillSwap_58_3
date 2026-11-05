// ─── Input Component ────────────────────────────────────────────────

import { type ChangeEvent } from 'react'
import { IconName } from '../icons'

export interface InputProps {
  id?: string
  label: string
  placeholder?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: 'text' | 'password'
  error?: string
  hint?: string
  iconLeft?: IconName
  iconRight?: IconName
  readOnly?: boolean
  onRightIconClick?: () => void
}
