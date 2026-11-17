import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchCategories } from '@/api/categories'
import { fetchCities } from '@/api/cities'
import { fetchSkills } from '@/api/skills'
import { fetchUsers } from '@/api/users'
import type { Category, City, LoadingStatus, Skill, User } from '@/shared/types'

export interface CatalogState {
  users: User[]
  skills: Skill[]
  categories: Category[]
  cities: City[]
  status: LoadingStatus
  error: string | null
}

const initialState: CatalogState = {
  users: [],
  skills: [],
  categories: [],
  cities: [],
  status: 'idle',
  error: null,
}

type CatalogPayload = {
  users: User[]
  skills: Skill[]
  categories: Category[]
  cities: City[]
}

// асинхронное действие загрузка всех данных каталога параллельно

export const loadCatalogData = createAsyncThunk<
  CatalogPayload,
  void,
  { state: { catalog: CatalogState } }
>(
  'catalog/loadData',
  async () => {
    const [users, skills, categories, cities] = await Promise.all([
      fetchUsers(),
      fetchSkills(),
      fetchCategories(),
      fetchCities(),
    ])
    return { users, skills, categories, cities }
  },
  {
    condition: (_arg, { getState }) => {
      const { status } = getState().catalog
      return status !== 'loading' && status !== 'succeeded'
    },
  },
)

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalogData.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadCatalogData.fulfilled, (state, action: PayloadAction<CatalogPayload>) => {
        state.status = 'succeeded'
        state.users = action.payload.users
        state.skills = action.payload.skills
        state.categories = action.payload.categories
        state.cities = action.payload.cities
        state.error = null
      })
      .addCase(loadCatalogData.rejected, (state, action) => {
        // condition-гард тоже бросает rejected с meta.condition === true — это не ошибка, игнорируем
        if (action.meta.condition) return
        state.status = 'failed'
        state.error = action.error.message ?? 'Не удалось загрузить каталог'
      })
  },
})

// cелекторы сигнатура { catalog: CatalogState } совместима и с тестовым store, и с RootState
export const selectUsers = (state: { catalog: CatalogState }) => state.catalog.users
export const selectSkills = (state: { catalog: CatalogState }) => state.catalog.skills
export const selectCategories = (state: { catalog: CatalogState }) => state.catalog.categories
export const selectCities = (state: { catalog: CatalogState }) => state.catalog.cities
export const selectCatalogStatus = (state: { catalog: CatalogState }) => state.catalog.status
export const selectCatalogError = (state: { catalog: CatalogState }) => state.catalog.error

export default catalogSlice.reducer
