import { createAsyncThunk } from '@reduxjs/toolkit'
import { filesToDataUrls } from '@/shared/lib/filesToDataUrls'
import type { RegisterPayload, Skill, User } from '@/shared/types'
import { skillAdded, userAdded } from '@/store/slices/catalogSlice'
import type { CatalogState } from '@/store/slices/catalogSlice'
import type { RegisterStep3Values } from '@/widgets/RegisterStep3Form'
import type { AuthState } from './authSlice'
import { logout, registerUser } from './authSlice'
import { getRegisteredUsers, removeRegisteredUser, saveRegisteredSkill } from './authUtils'

export interface CompleteRegistrationArg {
  register: RegisterPayload
  step3: RegisterStep3Values
}

export interface CompleteRegistrationResult {
  user: User
  skill: Skill
}

interface ThunkConfig {
  state: { auth: AuthState; catalog: CatalogState }
  rejectValue: string
}

export const completeRegistration = createAsyncThunk<
  CompleteRegistrationResult,
  CompleteRegistrationArg,
  ThunkConfig
>('auth/completeRegistration', async ({ register, step3 }, { dispatch, rejectWithValue }) => {
  const registerResult = await dispatch(registerUser(register))
  if (!registerUser.fulfilled.match(registerResult)) {
    return rejectWithValue(registerResult.payload ?? 'Не удалось зарегистрироваться')
  }

  const email = register.email.trim().toLowerCase()
  const createdUser = getRegisteredUsers().find((user) => user.email === email)
  if (!createdUser) {
    return rejectWithValue('Не удалось найти созданного пользователя')
  }

  const rollback = () => {
    removeRegisteredUser(createdUser.id)
    dispatch(logout())
  }

  let images: string[]
  try {
    images = await filesToDataUrls(step3.images)
  } catch {
    rollback()
    return rejectWithValue('Не удалось прочитать фото навыка')
  }

  const skill: Skill = {
    id: crypto.randomUUID(),
    title: step3.title,
    description: step3.description,
    type: 'teach',
    category: step3.categoryId,
    subcategory: step3.subcategoryId,
    tags: [],
    images,
    authorId: createdUser.id,
    createdAt: new Date().toISOString(),
  }

  try {
    saveRegisteredSkill(skill)
  } catch {
    rollback()
    return rejectWithValue('Не удалось сохранить навык. Попробуйте ещё раз')
  }

  dispatch(userAdded(createdUser))
  dispatch(skillAdded(skill))
  return { user: createdUser, skill }
})
