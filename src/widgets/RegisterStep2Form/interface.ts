import type { Gender } from '@/shared/types'
import type { SelectOption } from '@/shared/ui/Select'
import type { MultiSelectOption } from '@/shared/ui/MultiSelect'

export interface RegisterStep2Values {
  avatarUrl?: string
  name: string
  birthday: Date | null
  gender: Gender
  cityId: string
  categoryIds: string[]
  subcategoryIds: string[]
}

export interface RegisterStep2FormProps {
  values: RegisterStep2Values
  onChange: (values: RegisterStep2Values) => void
  errors?: Partial<Record<keyof RegisterStep2Values, string>>
  cityOptions: SelectOption[]
  categoryOptions: MultiSelectOption[]
  subcategoryOptions: MultiSelectOption[]
  onAvatarAdd: () => void
  onBack: () => void
  onSubmit: () => void
}
