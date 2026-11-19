import { fetchUsers } from '@/api/users'
import type { AuthUser, Skill, User } from '@/shared/types'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isAuthUser(value: unknown): value is AuthUser {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.email) &&
    isNonEmptyString(value.token)
  )
}

function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.email) &&
    isNonEmptyString(value.password) &&
    typeof value.town === 'string' &&
    typeof value.birthday === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.description === 'string' &&
    (value.avatarUrl === null || typeof value.avatarUrl === 'string') &&
    typeof value.likedCount === 'number' &&
    Number.isFinite(value.likedCount) &&
    value.likedCount >= 0 &&
    ['male', 'female', 'unspecified'].includes(value.gender as string) &&
    isStringArray(value.learn) &&
    isStringArray(value.favourites)
  )
}

/** Читает текущего авторизованного пользователя из localStorage */
export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)
    const parsed: unknown = raw ? JSON.parse(raw) : null
    return isAuthUser(parsed)
      ? { id: parsed.id, name: parsed.name, email: parsed.email, token: parsed.token }
      : null
  } catch {
    return null
  }
}

/** Сохраняет пользователя и mock-токен в localStorage */
export function saveAuthUser({ id, name, email }: Omit<AuthUser, 'token'>): AuthUser {
  const authUser: AuthUser = { id, name, email, token: 'mock_token_' + id }
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser))
  return authUser
}

/** Удаляет пользователя из localStorage (logout) */
export function clearAuthUser(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER)
}

/** Читает зарегистрированных в этом браузере mock-пользователей. */
export function getRegisteredUsers(): User[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS)
    const parsed: unknown = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? parsed.filter(isUser) : []
  } catch {
    return []
  }
}

/** Добавляет mock-пользователя или обновляет существующего по id. */
export function saveRegisteredUser(user: User): void {
  const users = getRegisteredUsers()
  const index = users.findIndex((existing) => existing.id === user.id)

  if (index >= 0) {
    users[index] = user
  } else {
    users.push(user)
  }

  localStorage.setItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users))
}

/** Проверяет email среди исходных и зарегистрированных mock-пользователей. */
export async function isEmailTaken(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase()
  const users = [...(await fetchUsers()), ...getRegisteredUsers()]
  return users.some((user) => user.email.trim().toLowerCase() === normalizedEmail)
}

function isSkill(value: unknown): value is Skill {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.description) &&
    (value.type === 'teach' || value.type === 'learn') &&
    isNonEmptyString(value.category) &&
    isNonEmptyString(value.subcategory) &&
    isStringArray(value.tags) &&
    isStringArray(value.images) &&
    isNonEmptyString(value.authorId) &&
    isNonEmptyString(value.createdAt)
  )
}

/** Читает зарегистрированные в этом браузере mock-навыки */
export function getRegisteredSkills(): Skill[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_SKILLS)
    const parsed: unknown = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? parsed.filter(isSkill) : []
  } catch {
    return []
  }
}

/** Добавляет навык, сохраняя ранее зарегистрированные */
export function saveRegisteredSkill(skill: Skill): void {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.REGISTERED_SKILLS,
    JSON.stringify([...getRegisteredSkills(), skill]),
  )
}

/** Удаляет пользователя из реестра регистраций (откат, если навык не сохранился) */
export function removeRegisteredUser(userId: string): void {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.REGISTERED_USERS,
    JSON.stringify(getRegisteredUsers().filter((user) => user.id !== userId)),
  )
}
