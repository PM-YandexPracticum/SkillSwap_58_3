import type { ChangeEvent } from 'react'

export interface SearchInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSearch: () => void
  onClear: () => void
  placeholder?: string
}
