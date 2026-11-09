export interface SearchSelectOption {
  value: string
  label: string
}

export interface SearchSelectProps {
  label?: string
  value?: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  options: SearchSelectOption[]
  error?: string
}
