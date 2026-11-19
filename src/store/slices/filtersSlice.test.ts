import { describe, expect, it } from 'vitest'
import { DEFAULT_FILTERS } from '@/widgets/Filters/constants'
import type { FiltersValues } from '@/widgets/Filters/interface'
import filtersReducer, {
  filterBySubcategory,
  resetFilters,
  selectFilters,
  selectSearch,
  setFilters,
  setSearch,
} from './filtersSlice'

const makeFilters = (): FiltersValues => ({
  purpose: 'learn',
  gender: 'female',
  categoryIds: ['creativity'],
  subcategoryIds: ['creativity-music-and-sound'],
  cityIds: ['moscow'],
})

describe('filtersSlice', () => {
  it('начинает с пустого поиска и независимой копии фильтров по умолчанию', () => {
    const state = filtersReducer(undefined, { type: 'unknown' })

    expect(state).toEqual({ search: '', values: DEFAULT_FILTERS })
    expect(state.values).not.toBe(DEFAULT_FILTERS)
    expect(state.values.categoryIds).not.toBe(DEFAULT_FILTERS.categoryIds)
    expect(state.values.subcategoryIds).not.toBe(DEFAULT_FILTERS.subcategoryIds)
    expect(state.values.cityIds).not.toBe(DEFAULT_FILTERS.cityIds)
  })

  it('изменяет поисковую строку, сохраняя фильтры и предыдущее состояние', () => {
    const previous = filtersReducer(undefined, setFilters(makeFilters()))
    const state = filtersReducer(previous, setSearch(' Барабаны '))

    expect(state.search).toBe(' Барабаны ')
    expect(state.values).toEqual(previous.values)
    expect(previous.search).toBe('')
  })

  it('заменяет все фильтры, сохраняя поиск', () => {
    const previous = filtersReducer(undefined, setSearch('барабаны'))
    const values = makeFilters()
    const state = filtersReducer(previous, setFilters(values))

    expect(state).toEqual({ search: 'барабаны', values })
    expect(previous.values).toEqual(DEFAULT_FILTERS)

    const replacement: FiltersValues = {
      purpose: 'teach',
      gender: 'any',
      categoryIds: [],
      subcategoryIds: [],
      cityIds: ['saint-petersburg'],
    }
    expect(filtersReducer(state, setFilters(replacement))).toEqual({
      search: 'барабаны',
      values: replacement,
    })
  })

  it('изолирует массивы состояния от последующих изменений payload', () => {
    const payload = makeFilters()
    const state = filtersReducer(undefined, setFilters(payload))

    expect(state.values).not.toBe(payload)
    expect(state.values.categoryIds).not.toBe(payload.categoryIds)
    expect(state.values.subcategoryIds).not.toBe(payload.subcategoryIds)
    expect(state.values.cityIds).not.toBe(payload.cityIds)
    expect(payload).toEqual(makeFilters())

    payload.categoryIds.push('health')
    payload.subcategoryIds.length = 0
    payload.cityIds[0] = 'saint-petersburg'

    expect(state.values).toEqual(makeFilters())
    expect(DEFAULT_FILTERS).toEqual({
      purpose: 'all',
      gender: 'any',
      categoryIds: [],
      subcategoryIds: [],
      cityIds: [],
    })
  })

  it('сбрасывает поиск и все фильтры, не используя массивы константы по ссылке', () => {
    const previous = filtersReducer(
      filtersReducer(undefined, setSearch('барабаны')),
      setFilters(makeFilters()),
    )
    const state = filtersReducer(previous, resetFilters())

    expect(state).toEqual({ search: '', values: DEFAULT_FILTERS })
    expect(state.values).not.toBe(DEFAULT_FILTERS)
    expect(state.values.categoryIds).not.toBe(DEFAULT_FILTERS.categoryIds)
    expect(state.values.subcategoryIds).not.toBe(DEFAULT_FILTERS.subcategoryIds)
    expect(state.values.cityIds).not.toBe(DEFAULT_FILTERS.cityIds)
    expect(previous).toEqual({ search: 'барабаны', values: makeFilters() })
  })

  it('селекторы читают search и values из ветки filters общего store', () => {
    const state = {
      filters: filtersReducer(
        filtersReducer(undefined, setSearch('барабаны')),
        setFilters(makeFilters()),
      ),
      unrelated: { value: true },
    }

    expect(selectSearch(state)).toBe('барабаны')
    expect(selectFilters(state)).toBe(state.filters.values)
  })
  it('filterBySubcategory оставляет только выбранную подкатегорию и сбрасывает остальное', () => {
    const before = filtersReducer(undefined, setFilters(makeFilters()))
    const withSearch = filtersReducer(before, setSearch('гитара'))

    const state = filtersReducer(withSearch, filterBySubcategory('business-sales'))

    expect(state.search).toBe('')
    expect(state.values).toEqual({ ...DEFAULT_FILTERS, subcategoryIds: ['business-sales'] })
  })
})
