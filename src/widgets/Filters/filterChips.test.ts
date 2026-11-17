import { describe, expect, it } from 'vitest'
import type { Category, City } from '@/shared/types'
import type { FiltersValues } from './interface'
import { getFilterChips, removeFilterChip } from './filterChips'

const categories: Category[] = [
  {
    id: 'creativity',
    name: 'Творчество и искусство',
    subcategories: [{ id: 'creativity-photography', name: 'Фотография' }],
  },
  {
    id: 'business',
    name: 'Бизнес и карьера',
    subcategories: [{ id: 'business-team-management', name: 'Управление командой' }],
  },
]

const cities: City[] = [
  { id: 'moscow', name: 'Москва' },
  { id: 'kazan', name: 'Казань' },
]

const makeValues = (changes: Partial<FiltersValues> = {}): FiltersValues => ({
  purpose: 'all',
  gender: 'any',
  categoryIds: [],
  subcategoryIds: [],
  cityIds: [],
  ...changes,
})

describe('getFilterChips', () => {
  it('не создаёт чипы для исходных значений', () => {
    expect(getFilterChips(makeValues(), categories, cities)).toEqual([])
  })

  it.each([
    ['learn', 'Хочу научиться'],
    ['teach', 'Могу научить'],
  ] as const)('показывает подпись цели %s', (purpose, label) => {
    expect(getFilterChips(makeValues({ purpose }), categories, cities)).toEqual([
      { id: `purpose:${purpose}`, label },
    ])
  })

  it.each([
    ['male', 'Мужской'],
    ['female', 'Женский'],
  ] as const)('показывает подпись пола %s', (gender, label) => {
    expect(getFilterChips(makeValues({ gender }), categories, cities)).toEqual([
      { id: `gender:${gender}`, label },
    ])
  })

  it('получает названия из справочников и сохраняет несколько выбранных городов', () => {
    const values = makeValues({
      categoryIds: ['creativity'],
      subcategoryIds: ['business-team-management'],
      cityIds: ['moscow', 'kazan'],
    })

    expect(getFilterChips(values, categories, cities)).toEqual([
      { id: 'category:creativity', label: 'Творчество и искусство' },
      { id: 'subcategory:business-team-management', label: 'Управление командой' },
      { id: 'city:moscow', label: 'Москва' },
      { id: 'city:kazan', label: 'Казань' },
    ])
  })

  it('показывает неизвестные ID, чтобы соответствующий фильтр можно было удалить', () => {
    const values = makeValues({
      categoryIds: ['unknown-category'],
      subcategoryIds: ['unknown-subcategory'],
      cityIds: ['unknown-city'],
    })

    expect(getFilterChips(values, categories, cities)).toEqual([
      { id: 'category:unknown-category', label: 'unknown-category' },
      { id: 'subcategory:unknown-subcategory', label: 'unknown-subcategory' },
      { id: 'city:unknown-city', label: 'unknown-city' },
    ])
  })
})

describe('removeFilterChip', () => {
  it('сбрасывает выбранную цель и пол, сохраняя остальные значения', () => {
    const values = makeValues({ purpose: 'teach', gender: 'female', cityIds: ['moscow'] })

    const withoutPurpose = removeFilterChip(values, 'purpose:teach', categories)
    expect(withoutPurpose).toEqual({ ...values, purpose: 'all' })
    expect(removeFilterChip(withoutPurpose, 'gender:female', categories)).toEqual({
      ...values,
      purpose: 'all',
      gender: 'any',
    })
  })

  it('удаляет только выбранный город или подкатегорию', () => {
    const values = makeValues({
      subcategoryIds: ['creativity-photography', 'business-team-management'],
      cityIds: ['moscow', 'kazan'],
    })

    expect(removeFilterChip(values, 'city:moscow', categories)).toEqual({
      ...values,
      cityIds: ['kazan'],
    })
    expect(removeFilterChip(values, 'subcategory:creativity-photography', categories)).toEqual({
      ...values,
      subcategoryIds: ['business-team-management'],
    })
  })

  it('вместе с категорией удаляет её подкатегории, сохраняя другую категорию', () => {
    const values = makeValues({
      categoryIds: ['creativity', 'business'],
      subcategoryIds: ['creativity-photography', 'business-team-management'],
      cityIds: ['moscow'],
    })

    expect(removeFilterChip(values, 'category:creativity', categories)).toEqual({
      ...values,
      categoryIds: ['business'],
      subcategoryIds: ['business-team-management'],
    })
  })

  it('позволяет удалить неизвестный ID, включая двоеточие в его значении', () => {
    const values = makeValues({
      categoryIds: ['unknown-category'],
      subcategoryIds: ['unknown-subcategory'],
      cityIds: ['unknown:city', 'moscow'],
    })

    const withoutCategory = removeFilterChip(values, 'category:unknown-category', categories)
    expect(withoutCategory.categoryIds).toEqual([])
    expect(withoutCategory.subcategoryIds).toEqual(['unknown-subcategory'])
    expect(
      removeFilterChip(values, 'subcategory:unknown-subcategory', categories).subcategoryIds,
    ).toEqual([])
    expect(removeFilterChip(values, 'city:unknown:city', categories).cityIds).toEqual(['moscow'])
  })

  it('не сбрасывает новое значение по устаревшему чипу и игнорирует неизвестный тип', () => {
    const values = makeValues({ purpose: 'teach', gender: 'female' })

    expect(removeFilterChip(values, 'purpose:learn', categories)).toEqual(values)
    expect(removeFilterChip(values, 'gender:male', categories)).toEqual(values)
    expect(removeFilterChip(values, 'other:value', categories)).toEqual(values)
  })

  it('не изменяет исходный объект и его массивы', () => {
    const values = makeValues({
      purpose: 'learn',
      gender: 'male',
      categoryIds: ['creativity'],
      subcategoryIds: ['creativity-photography'],
      cityIds: ['moscow', 'kazan'],
    })
    Object.freeze(values)
    Object.freeze(values.categoryIds)
    Object.freeze(values.subcategoryIds)
    Object.freeze(values.cityIds)

    const chips = getFilterChips(values, categories, cities)
    for (const chip of chips) removeFilterChip(values, chip.id, categories)

    expect(values).toEqual({
      purpose: 'learn',
      gender: 'male',
      categoryIds: ['creativity'],
      subcategoryIds: ['creativity-photography'],
      cityIds: ['moscow', 'kazan'],
    })
  })
})
