// ─── Input Component ────────────────────────────────────────────────

import { type ChangeEvent } from 'react'

export interface InputProps {
  id?: string
  label: string
  placeholder?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: 'text' | 'password'
  error?: string
  hint?: string
  iconLeft?: string
  iconRight?: string
  readOnly?: boolean
  onRightIconClick?: () => void
}
