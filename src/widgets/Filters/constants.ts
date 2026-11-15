import type { FilterGender, FilterPurpose, FiltersValues } from './interface'

export const PURPOSE_OPTIONS: { value: FilterPurpose; label: string }[] = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
]

export const GENDER_OPTIONS: { value: FilterGender; label: string }[] = [
  { value: 'any', label: 'Не имеет значения' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

export const DEFAULT_FILTERS: FiltersValues = {
  purpose: 'all',
  gender: 'any',
  categoryIds: [],
  subcategoryIds: [],
  cityIds: [],
}
