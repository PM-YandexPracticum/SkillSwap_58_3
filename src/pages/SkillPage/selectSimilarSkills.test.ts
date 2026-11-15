import { describe, expect, it } from 'vitest'
import type { Skill, User } from '@/shared/types'
import skillFixture from '../../../public/db/skills.json'
import userFixture from '../../../public/db/users.json'
import { selectSimilarSkills, SIMILAR_SKILLS_COUNT } from './selectSimilarSkills'

const currentSkill: Skill = { ...skillFixture[0], type: 'teach' }

const makeSkill = (
  id: string,
  authorId: string,
  subcategory = currentSkill.subcategory,
  category = currentSkill.category,
): Skill => ({ ...currentSkill, id, authorId, subcategory, category })

const makeUsers = (ids: string[]): User[] =>
  ids.map((id) => ({
    ...userFixture[0],
    id,
    gender: 'unspecified',
    description: '',
    likedCount: 0,
  }))

describe('selectSimilarSkills', () => {
  it('сначала рекомендует ту же подкатегорию, затем остальных авторов категории', () => {
    const skills = [
      makeSkill('category-1', 'user-1', 'creativity-drawing-and-illustration'),
      makeSkill('subcategory-1', 'user-2'),
      makeSkill('category-2', 'user-3', 'creativity-art-therapy'),
      makeSkill('subcategory-2', 'user-4'),
    ]
    const originalOrder = [...skills]

    const result = selectSimilarSkills(
      currentSkill,
      skills,
      makeUsers(['user-1', 'user-2', 'user-3', 'user-4']),
    )

    expect(result.map((skill) => skill.id)).toEqual([
      'subcategory-1',
      'subcategory-2',
      'category-1',
      'category-2',
    ])
    expect(skills).toEqual(originalOrder)
  })

  it('исключает текущий навык, его автора и неизвестных авторов, убирает повторы', () => {
    const skills = [
      makeSkill(currentSkill.id, 'duplicate-id-author'),
      makeSkill('same-author', currentSkill.authorId),
      makeSkill('other-category', 'other-author', 'business-resume-and-interview', 'business'),
      makeSkill('missing-author', 'missing-user'),
      makeSkill('category-duplicate', 'same-user', 'creativity-art-therapy'),
      makeSkill('subcategory-match', 'same-user'),
      makeSkill('second-match', 'same-user'),
      makeSkill('another-user', 'another-user'),
    ]

    const result = selectSimilarSkills(
      currentSkill,
      skills,
      makeUsers([
        currentSkill.authorId,
        'duplicate-id-author',
        'other-author',
        'same-user',
        'another-user',
      ]),
    )

    expect(result.map((skill) => skill.id)).toEqual(['subcategory-match', 'another-user'])
  })

  it('ограничивает количество рекомендаций и возвращает пустой список без кандидатов', () => {
    const skills = Array.from({ length: SIMILAR_SKILLS_COUNT + 2 }, (_, index) =>
      makeSkill(`candidate-${index}`, `author-${index}`),
    )
    const users = makeUsers(skills.map((skill) => skill.authorId))

    expect(selectSimilarSkills(currentSkill, skills, users)).toEqual(
      skills.slice(0, SIMILAR_SKILLS_COUNT),
    )
    expect(selectSimilarSkills(currentSkill, [currentSkill], users)).toEqual([])
  })
})
