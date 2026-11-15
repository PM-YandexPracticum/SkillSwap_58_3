import type { Skill, User } from '@/shared/types'

export const SIMILAR_SKILLS_COUNT = 4

export function selectSimilarSkills(currentSkill: Skill, skills: Skill[], users: User[]): Skill[] {
  const availableAuthors = new Set(users.map((user) => user.id))
  const candidates = skills.filter(
    (skill) =>
      skill.id !== currentSkill.id &&
      skill.authorId !== currentSkill.authorId &&
      skill.category === currentSkill.category &&
      availableAuthors.has(skill.authorId),
  )
  const prioritized = [
    ...candidates.filter((skill) => skill.subcategory === currentSkill.subcategory),
    ...candidates.filter((skill) => skill.subcategory !== currentSkill.subcategory),
  ]
  const authors = new Set<string>()

  return prioritized
    .filter((skill) => {
      if (authors.has(skill.authorId)) return false
      authors.add(skill.authorId)
      return true
    })
    .slice(0, SIMILAR_SKILLS_COUNT)
}
