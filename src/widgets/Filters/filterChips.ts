import type { Category, City } from '@/shared/types'
import { DEFAULT_FILTERS, GENDER_OPTIONS, PURPOSE_OPTIONS } from './constants'
import type { FiltersValues } from './interface'

export interface FilterChipData {
  id: string
  label: string
}

export function getFilterChips(
  values: FiltersValues,
  categories: Category[],
  cities: City[],
): FilterChipData[] {
  const chips: FilterChipData[] = []
  if (values.purpose !== DEFAULT_FILTERS.purpose) {
    chips.push({
      id: `purpose:${values.purpose}`,
      label:
        PURPOSE_OPTIONS.find((option) => option.value === values.purpose)?.label ?? values.purpose,
    })
  }
  if (values.gender !== DEFAULT_FILTERS.gender) {
    chips.push({
      id: `gender:${values.gender}`,
      label:
        GENDER_OPTIONS.find((option) => option.value === values.gender)?.label ?? values.gender,
    })
  }

  const subcategories = categories.flatMap((category) => category.subcategories)
  chips.push(
    ...values.categoryIds.map((id) => ({
      id: `category:${id}`,
      label: categories.find((category) => category.id === id)?.name ?? id,
    })),
    ...values.subcategoryIds.map((id) => ({
      id: `subcategory:${id}`,
      label: subcategories.find((subcategory) => subcategory.id === id)?.name ?? id,
    })),
    ...values.cityIds.map((id) => ({
      id: `city:${id}`,
      label: cities.find((city) => city.id === id)?.name ?? id,
    })),
  )
  return chips
}

export function removeFilterChip(
  values: FiltersValues,
  chipId: string,
  categories: Category[],
): FiltersValues {
  const separator = chipId.indexOf(':')
  const type = chipId.slice(0, separator)
  const id = chipId.slice(separator + 1)

  switch (type) {
    case 'purpose':
      return id === values.purpose ? { ...values, purpose: DEFAULT_FILTERS.purpose } : values
    case 'gender':
      return id === values.gender ? { ...values, gender: DEFAULT_FILTERS.gender } : values
    case 'category': {
      const childIds = new Set(
        categories.find((category) => category.id === id)?.subcategories.map((child) => child.id),
      )
      return {
        ...values,
        categoryIds: values.categoryIds.filter((value) => value !== id),
        subcategoryIds: values.subcategoryIds.filter((value) => !childIds.has(value)),
      }
    }
    case 'subcategory':
      return { ...values, subcategoryIds: values.subcategoryIds.filter((value) => value !== id) }
    case 'city':
      return { ...values, cityIds: values.cityIds.filter((value) => value !== id) }
    default:
      return values
  }
}
