import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { fetchUsers } from '@/api/users'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { AuthUser, LoginCredentials, RegisterPayload, User } from '@/shared/types'
import {
  clearAuthUser,
  getAuthUser,
  getRegisteredUsers,
  isEmailTaken,
  saveAuthUser,
  saveRegisteredUser,
} from './authUtils'

export interface AuthState {
  user: AuthUser | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  currentRequestId: string | null
}

interface AuthThunkConfig {
  state: { auth: AuthState }
  rejectValue: string
}

const authRequestOptions = {
  condition: (_: unknown, { getState }: { getState: () => AuthThunkConfig['state'] }) =>
    getState().auth.status !== 'loading',
}

export const loginUser = createAsyncThunk<AuthUser, LoginCredentials, AuthThunkConfig>(
  'auth/loginUser',
  async ({ email, password }, { getState, requestId, signal, rejectWithValue }) => {
    try {
      const users = [...(await fetchUsers()), ...getRegisteredUsers()]
      const normalizedEmail = email.trim().toLowerCase()
      const user = users.find(
        (item) => item.email.trim().toLowerCase() === normalizedEmail && item.password === password,
      )
      if (!user) return rejectWithValue('Неверная почта или пароль')
      if (signal.aborted || getState().auth.currentRequestId !== requestId) {
        return rejectWithValue('Запрос авторизации отменён')
      }
      return saveAuthUser(user)
    } catch {
      return rejectWithValue('Не удалось войти. Попробуйте ещё раз')
    }
  },
  authRequestOptions,
)

export const registerUser = createAsyncThunk<AuthUser, RegisterPayload, AuthThunkConfig>(
  'auth/registerUser',
  async (payload, { getState, requestId, signal, rejectWithValue }) => {
    try {
      const email = payload.email.trim().toLowerCase()
      if (await isEmailTaken(email)) {
        return rejectWithValue('Пользователь с такой почтой уже зарегистрирован')
      }
      if (signal.aborted || getState().auth.currentRequestId !== requestId) {
        return rejectWithValue('Запрос регистрации отменён')
      }
      const user: User = {
        ...payload,
        id: crypto.randomUUID(),
        email,
        avatarUrl: payload.avatarUrl ?? null,
        description: payload.description ?? '',
        createdAt: new Date().toISOString(),
        likedCount: 0,
        favourites: [],
      }
      const previousUsers = localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS)
      saveRegisteredUser(user)
      try {
        return saveAuthUser(user)
      } catch (error) {
        if (previousUsers === null) localStorage.removeItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS)
        else localStorage.setItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, previousUsers)
        throw error
      }
    } catch {
      return rejectWithValue('Не удалось зарегистрироваться. Попробуйте ещё раз')
    }
  },
  authRequestOptions,
)

export const authSlice = createSlice({
  name: 'auth',
  initialState: (): AuthState => ({
    user: getAuthUser(),
    status: 'idle',
    error: null,
    currentRequestId: null,
  }),
  reducers: {
    setAuthUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
      state.status = 'idle'
      state.error = null
      state.currentRequestId = null
      try {
        clearAuthUser()
      } catch {
        state.error = 'Не удалось удалить сохранённую сессию'
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(loginUser.pending, registerUser.pending), (state, action) => {
        state.status = 'loading'
        state.error = null
        state.currentRequestId = action.meta.requestId
      })
      .addMatcher(isAnyOf(loginUser.fulfilled, registerUser.fulfilled), (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return
        state.user = action.payload
        state.status = 'succeeded'
        state.error = null
        state.currentRequestId = null
      })
      .addMatcher(isAnyOf(loginUser.rejected, registerUser.rejected), (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return
        state.status = 'failed'
        state.error = action.payload ?? 'Не удалось выполнить авторизацию'
        state.currentRequestId = null
      })
  },
})

export const { logout, setAuthUser } = authSlice.actions
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthorized = (state: { auth: AuthState }) => state.auth.user !== null
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
export default authSlice.reducer
