import type { RegisterPayload } from '@/shared/types'
import type { RegisterStep2FormProps, RegisterStep2Values } from '@/widgets/RegisterStep2Form'
import type { RegisterStep3Errors, RegisterStep3Values } from '@/widgets/RegisterStep3Form'
import { REGISTER_ERRORS } from './constants'

type Credentials = Pick<RegisterPayload, 'email' | 'password'>

export const INITIAL_CREDENTIALS: Credentials = { email: '', password: '' }

export const INITIAL_STEP2: RegisterStep2Values = {
  name: '',
  birthday: null,
  gender: 'unspecified',
  cityId: '',
  categoryIds: [],
  subcategoryIds: [],
}

export const INITIAL_STEP3: RegisterStep3Values = {
  title: '',
  categoryId: '',
  subcategoryId: '',
  description: '',
  images: [],
}

const hasErrors = (errors: object) => Object.keys(errors).length > 0

export function validateStep2(values: RegisterStep2Values) {
  const errors: NonNullable<RegisterStep2FormProps['errors']> = {}
  if (!values.name.trim()) errors.name = REGISTER_ERRORS.nameRequired
  if (!values.birthday) errors.birthday = REGISTER_ERRORS.birthdayRequired
  return { errors, isValid: !hasErrors(errors) }
}

export function validateStep3(values: RegisterStep3Values) {
  const errors: RegisterStep3Errors = {}
  if (!values.title.trim()) errors.title = REGISTER_ERRORS.titleRequired
  if (!values.categoryId) errors.categoryId = REGISTER_ERRORS.categoryRequired
  if (!values.subcategoryId) errors.subcategoryId = REGISTER_ERRORS.subcategoryRequired
  if (!values.description.trim()) errors.description = REGISTER_ERRORS.descriptionRequired
  return { errors, isValid: !hasErrors(errors) }
}

// в моках дата рождения хранится как 2026-01-31
function formatBirthday(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function buildRegisterPayload(
  credentials: Credentials,
  values: RegisterStep2Values,
): RegisterPayload {
  return {
    ...credentials,
    name: values.name.trim(),
    birthday: values.birthday ? formatBirthday(values.birthday) : '',
    gender: values.gender,
    town: values.cityId,
    learn: values.subcategoryIds,
  }
}
