import type { SelectOption } from '@/shared/ui/Select'

export interface RegisterStep3Values {
  title: string
  categoryId: string
  subcategoryId: string
  description: string
  images: File[]
}

export type RegisterStep3Errors = Partial<Record<keyof RegisterStep3Values, string>>

/** Подкатегория знает свою категорию, по ней при выборе проставляется categoryId. */
export interface SubcategoryOption extends SelectOption {
  categoryId: string
}

export interface RegisterStep3FormProps {
  values: RegisterStep3Values
  /** Получает новый объект значений целиком. */
  onChange: (values: RegisterStep3Values) => void
  errors?: RegisterStep3Errors
  categoryOptions: SelectOption[]
  subcategoryOptions: SubcategoryOption[]
  onBack: () => void
  onSubmit: () => void
}
