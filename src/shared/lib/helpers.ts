import { ProfileFormData, ProfileFormField } from '@/widgets/ProfileEditForm'
import { getEmailError } from './emailValidation'
import { getPasswordError } from './passwordValidation'
import { User } from '../types'

/** Форматирует дату в читаемый вид */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Обрезает строку до maxLength символов */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/** Генерирует уникальный id */
export function generateId(): string {
  return crypto.randomUUID()
}

export function checkSomeFieldsAndReturnError(
  formData: ProfileFormData,
  isPasswordVisible: boolean,
  allUsers: User[],
  currentUserId?: string,
) {
  const errors = {} as Partial<Record<ProfileFormField, string>>

  const errorEmail = getEmailError(formData.email)

  if (errorEmail) {
    errors.email = errorEmail
  } else if (
    allUsers.some(
      (user) =>
        user.id !== currentUserId &&
        user.email.trim().toLowerCase() === formData.email.trim().toLowerCase(),
    )
  ) {
    errors.email = 'Почта уже существует'
  }

  if (!formData.name.trim()) errors.name = 'Введите имя'

  if (isPasswordVisible && formData.password) {
    const errorPassword = getPasswordError(formData.password)
    if (errorPassword) errors.password = errorPassword
  }

  return errors
}

export const mapFormDataToUser = (formData: ProfileFormData, user: User): User => ({
  ...user,
  ...formData,
  password: formData.password || user.password,
})
