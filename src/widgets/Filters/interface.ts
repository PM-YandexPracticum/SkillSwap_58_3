// цель обмена (всё - хочу научиться - могу научить)
export type FilterPurpose = 'all' | 'learn' | 'teach'

// пол автора (не имеет значения - мужской - женский)
export type FilterGender = 'any' | 'male' | 'female'

// текущие значения фильтров
export interface FiltersValues {
  purpose: FilterPurpose
  gender: FilterGender
  // id выбранных категорий
  categoryIds: string[]
  // id выбранных подкатегорий
  subcategoryIds: string[]
  // id выбранных городов
  cityIds: string[]
}

export interface FiltersProps {
  // при наличии значения фильтров контролирует родитель
  values?: FiltersValues
  // вызывется сразу, дает объект целиком
  onChange?: (values: FiltersValues) => void
  // вызывается после сброса значений явной кнопкой «Сбросить»
  onReset?: () => void
  // класс наружи для доп стилей компонента
  className?: string
}
