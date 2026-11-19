import type { Gender, User } from '@/shared/types'
import type { SelectOption } from '@/shared/ui/Select'

export interface ProfileFormData {
  email: string
  password: string
  name: string
  birthday: string
  gender: Gender
  town: string
  description: string
}

export type ProfileFormField = keyof ProfileFormData

export interface ProfileEditFormProps {
  currentUser: User | null
  errors?: Partial<Record<ProfileFormField, string>>
  onSave: (data: ProfileFormData, isPasswordBlockVisible: boolean) => void
  cityOptions?: SelectOption[]
  className?: string
}
