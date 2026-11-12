import { Category, CategoryId, Skill, SubcategoryId, User, UserId } from '@/shared/types'
import { Dictionaries } from './types'

const getAgeInYears = (birthdayUser: string | Date, currentDate?: Date | null): number => {
  const birthday = typeof birthdayUser === 'string' ? new Date(birthdayUser) : birthdayUser

  if (!birthday || isNaN(birthday.getTime())) {
    throw new Error('Некорректная дата рождения')
  }

  const referenceDate = currentDate ?? new Date()

  if (referenceDate < birthday) {
    throw new Error('Дата расчёта не может быть раньше даты рождения')
  }

  let age = referenceDate.getFullYear() - birthday.getFullYear()

  const monthDiff = referenceDate.getMonth() - birthday.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthday.getDate())) {
    age--
  }

  return age
}

const transformTeachFromSkills = (skills: Skill[], userId: UserId) => {
  if (!Array.isArray(skills)) {
    return []
  }

  const teach = skills
    .filter((skill) => skill.authorId === userId)
    .map((skill) => ({
      id: skill.id,
      label: skill.title,
      categoryId: skill.category,
    }))

  return teach
}

const transformLearnFromSubCat = (subCatIds: SubcategoryId[], categories: Category[]) => {
  if (!Array.isArray(subCatIds) || !Array.isArray(categories)) {
    return []
  }

  const subcategoryById = new Map<SubcategoryId, { label: string; categoryId: CategoryId }>()

  for (const category of categories) {
    for (const subcategory of category.subcategories) {
      subcategoryById.set(subcategory.id, { label: subcategory.name, categoryId: category.id })
    }
  }

  const result = []

  for (const id of subCatIds) {
    const found = subcategoryById.get(id)

    if (!found) continue
    result.push({ id, label: found.label, categoryId: found.categoryId })
  }

  return result
}

export const mapUserToCardData = (
  user: User,
  dictionaries: Dictionaries,
  currentDate: null | Date = null,
) => {
  if (!user) {
    return null
  }

  const currentCityName = dictionaries?.cities?.find((city) => city.id === user.town)?.name || ''

  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    description: user.description,
    city: currentCityName,
    age: getAgeInYears(user.birthday, currentDate),
    teach: transformTeachFromSkills(dictionaries?.skills ?? [], user.id),
    learn: transformLearnFromSubCat(user.learn, dictionaries?.categories ?? []),
  }
}
