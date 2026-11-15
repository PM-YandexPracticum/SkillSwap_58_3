import type { Category, CategoryId, Skill, SubcategoryId, User } from '@/shared/types'
import type { FilterGender, FilterPurpose, FiltersValues } from './interface'

const GENDER_ANY: FilterGender = 'any'
const PURPOSE_LEARN: FilterPurpose = 'learn'
const PURPOSE_TEACH: FilterPurpose = 'teach'

export interface FilterUsersParams {
  users: User[]
  filters: FiltersValues
  /** Строка поиска из шапки. */
  search: string
  skills: Skill[]
  categories: Category[]
}

interface SkillPair {
  categoryId: CategoryId
  subcategoryId: SubcategoryId
}

const hasSearchMatch = (userSkills: Skill[], search: string): boolean => {
  const query = search.trim().toLowerCase()
  if (!query) return true

  return userSkills.some((skill) => skill.title.toLowerCase().includes(query))
}

const getCategoryIdBySubcategory = (categories: Category[]): Map<SubcategoryId, CategoryId> => {
  const result = new Map<SubcategoryId, CategoryId>()

  for (const category of categories) {
    for (const subcategory of category.subcategories) {
      result.set(subcategory.id, category.id)
    }
  }

  return result
}

// Что пользователь умеет: пары из его навыков.
const getTeachPairs = (userSkills: Skill[]): SkillPair[] =>
  userSkills.map((skill) => ({ categoryId: skill.category, subcategoryId: skill.subcategory }))

// Чему хочет научиться: подкатегории из user.learn, категорию берём из справочника.
const getLearnPairs = (
  user: User,
  categoryIdBySubcategory: Map<SubcategoryId, CategoryId>,
): SkillPair[] =>
  user.learn.map((subcategoryId) => ({
    subcategoryId,
    categoryId: categoryIdBySubcategory.get(subcategoryId) ?? '',
  }))

// "Хочу научиться" ищет тех, кто учит; "Могу научить" ищет тех, кто хочет учиться
const getPairsByPurpose = (
  purpose: FilterPurpose,
  teachPairs: SkillPair[],
  learnPairs: SkillPair[],
): SkillPair[] => {
  if (purpose === PURPOSE_LEARN) return teachPairs
  if (purpose === PURPOSE_TEACH) return learnPairs
  return [...teachPairs, ...learnPairs]
}

const matchesSelection = (pairs: SkillPair[], filters: FiltersValues): boolean =>
  pairs.some(
    ({ categoryId, subcategoryId }) =>
      filters.categoryIds.includes(categoryId) || filters.subcategoryIds.includes(subcategoryId),
  )

/**
 * Оставляет пользователей, подходящих под поиск и все включённые фильтры (условия через "и").
 * Выключенное условие ничего не отсеивает. Переданные данные не меняются.
 */
export function filterUsers({
  users,
  filters,
  search,
  skills,
  categories,
}: FilterUsersParams): User[] {
  const categoryIdBySubcategory = getCategoryIdBySubcategory(categories)
  const isSelectionOn = filters.categoryIds.length > 0 || filters.subcategoryIds.length > 0

  return users.filter((user) => {
    const userSkills = skills.filter((skill) => skill.authorId === user.id)

    if (!hasSearchMatch(userSkills, search)) return false
    if (filters.gender !== GENDER_ANY && user.gender !== filters.gender) return false
    if (filters.cityIds.length > 0 && !filters.cityIds.includes(user.town)) return false

    if (isSelectionOn) {
      const pairs = getPairsByPurpose(
        filters.purpose,
        getTeachPairs(userSkills),
        getLearnPairs(user, categoryIdBySubcategory),
      )
      if (!matchesSelection(pairs, filters)) return false
    }

    return true
  })
}
