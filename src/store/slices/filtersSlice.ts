import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_FILTERS } from '@/widgets/Filters/constants'
import type { FiltersValues } from '@/widgets/Filters/interface'

export interface FiltersState {
  search: string
  values: FiltersValues
}

function cloneFilters(values: FiltersValues): FiltersValues {
  return {
    ...values,
    categoryIds: [...values.categoryIds],
    subcategoryIds: [...values.subcategoryIds],
    cityIds: [...values.cityIds],
  }
}

const initialState: FiltersState = {
  search: '',
  values: cloneFilters(DEFAULT_FILTERS),
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setFilters(state, action: PayloadAction<FiltersValues>) {
      state.values = cloneFilters(action.payload)
    },
    // фильтр по одной подкатегории: остальные фильтры и поиск сбрасываются
    filterBySubcategory(_state, action: PayloadAction<string>) {
      return {
        search: '',
        values: { ...cloneFilters(DEFAULT_FILTERS), subcategoryIds: [action.payload] },
      }
    },
    resetFilters() {
      return { search: '', values: cloneFilters(DEFAULT_FILTERS) }
    },
  },
})

export const { setSearch, setFilters, filterBySubcategory, resetFilters } = filtersSlice.actions
export const selectSearch = (state: { filters: FiltersState }) => state.filters.search
export const selectFilters = (state: { filters: FiltersState }) => state.filters.values
export default filtersSlice.reducer
