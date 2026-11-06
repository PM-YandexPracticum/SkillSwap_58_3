// ─── DatePicker Component ───────────────────────────────────────────

export interface DatePickerProps {
  label: string
  placeholder?: string
  value: Date | null
  onChange: (date: Date | null) => void
  error?: string
}
