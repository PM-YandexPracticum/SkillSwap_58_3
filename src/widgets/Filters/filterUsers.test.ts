import { describe, expect, it } from 'vitest'
import type { Category, Skill, User } from '@/shared/types'
import { filterUsers } from './filterUsers'
import type { FiltersValues } from './interface'

const DEFAULT_VALUES: FiltersValues = {
  purpose: 'all',
  gender: 'any',
  categoryIds: [],
  subcategoryIds: [],
  cityIds: [],
}

const categories: Category[] = [
  {
    id: 'creativity',
    name: 'Творчество',
    subcategories: [
      { id: 'creativity-photo', name: 'Фотография' },
      { id: 'creativity-drums', name: 'Барабаны' },
    ],
  },
  {
    id: 'languages',
    name: 'Языки',
    subcategories: [
      { id: 'languages-english', name: 'Английский' },
      { id: 'languages-german', name: 'Немецкий' },
    ],
  },
]

const createUser = (overrides: Partial<User> & Pick<User, 'id'>): User => ({
  name: overrides.id,
  email: `${overrides.id}@example.com`,
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00Z',
  password: '',
  town: 'moscow',
  birthday: '1990-01-01',
  likedCount: 0,
  description: '',
  gender: 'male',
  learn: [],
  favourites: [],
  ...overrides,
})

const createSkill = (overrides: Partial<Skill> & Pick<Skill, 'id' | 'authorId'>): Skill => ({
  title: overrides.id,
  description: '',
  type: 'teach',
  category: 'creativity',
  subcategory: 'creativity-photo',
  tags: [],
  images: [],
  createdAt: '2026-01-01T00:00:00Z',
  ...overrides,
})

// ivan: москва, мужчина, учит портретам (фото), хочет учить немецкий
// anna: питер, женщина, учит английскому, хочет учиться барабанам
// oleg: москва, мужчина, учит барабанам, хочет учиться английскому
const ivan = createUser({ id: 'ivan', town: 'moscow', gender: 'male', learn: ['languages-german'] })
const anna = createUser({ id: 'anna', town: 'spb', gender: 'female', learn: ['creativity-drums'] })
const oleg = createUser({
  id: 'oleg',
  town: 'moscow',
  gender: 'male',
  learn: ['languages-english'],
})
const users = [ivan, anna, oleg]

const skills = [
  createSkill({ id: 's1', authorId: 'ivan', title: 'Портретная фотография' }),
  createSkill({
    id: 's2',
    authorId: 'anna',
    title: 'Разговорный английский',
    category: 'languages',
    subcategory: 'languages-english',
  }),
  createSkill({
    id: 's3',
    authorId: 'oleg',
    title: 'Игра на барабанах',
    subcategory: 'creativity-drums',
  }),
]

const run = (filters: Partial<FiltersValues> = {}, search = '') =>
  filterUsers({
    users,
    filters: { ...DEFAULT_VALUES, ...filters },
    search,
    skills,
    categories,
  }).map((user) => user.id)

describe('filterUsers', () => {
  describe('пустые условия', () => {
    it('возвращает всех пользователей при фильтрах по умолчанию и пустом поиске', () => {
      expect(run()).toEqual(['ivan', 'anna', 'oleg'])
    })

    it('возвращает новый массив, а не переданный', () => {
      const result = filterUsers({
        users,
        filters: DEFAULT_VALUES,
        search: '',
        skills,
        categories,
      })

      expect(result).not.toBe(users)
    })

    it('считает поиск из одних пробелов выключенным', () => {
      expect(run({}, '   ')).toEqual(['ivan', 'anna', 'oleg'])
    })
  })

  describe('поиск', () => {
    it('находит пользователя по названию его навыка', () => {
      expect(run({}, 'фотограф')).toEqual(['ivan'])
    })

    it('не учитывает регистр', () => {
      expect(run({}, 'АНГЛИЙСКИЙ')).toEqual(['anna'])
    })

    it('не ищет по навыкам других авторов', () => {
      expect(run({}, 'барабан')).toEqual(['oleg'])
    })
  })

  describe('пол', () => {
    it('оставляет только выбранный пол', () => {
      expect(run({ gender: 'female' })).toEqual(['anna'])
      expect(run({ gender: 'male' })).toEqual(['ivan', 'oleg'])
    })
  })

  describe('города', () => {
    it('оставляет пользователей из выбранных городов', () => {
      expect(run({ cityIds: ['spb'] })).toEqual(['anna'])
    })

    it('допускает несколько городов', () => {
      expect(run({ cityIds: ['spb', 'moscow'] })).toEqual(['ivan', 'anna', 'oleg'])
    })
  })

  describe('навыки и цель', () => {
    it('purpose all смотрит и навыки, которым учат, и то, чему хотят учиться', () => {
      expect(run({ purpose: 'all', categoryIds: ['languages'] })).toEqual(['ivan', 'anna', 'oleg'])
    })

    it('purpose learn (хочу научиться) смотрит навыки, которым пользователь учит', () => {
      expect(run({ purpose: 'learn', categoryIds: ['languages'] })).toEqual(['anna'])
    })

    it('purpose teach (могу научить) смотрит то, чему пользователь хочет учиться', () => {
      expect(run({ purpose: 'teach', categoryIds: ['languages'] })).toEqual(['ivan', 'oleg'])
    })

    it('подходит по подкатегории', () => {
      expect(run({ purpose: 'learn', subcategoryIds: ['creativity-drums'] })).toEqual(['oleg'])
    })

    it('подходит, если совпала категория или подкатегория', () => {
      expect(
        run({
          purpose: 'learn',
          categoryIds: ['languages'],
          subcategoryIds: ['creativity-drums'],
        }),
      ).toEqual(['anna', 'oleg'])
    })

    it('без выбранных категорий и подкатегорий условие выключено при любом purpose', () => {
      expect(run({ purpose: 'learn' })).toEqual(['ivan', 'anna', 'oleg'])
      expect(run({ purpose: 'teach' })).toEqual(['ivan', 'anna', 'oleg'])
    })
  })

  describe('сочетание условий', () => {
    it('сочетает два условия через и', () => {
      expect(run({ gender: 'male', cityIds: ['moscow'] })).toEqual(['ivan', 'oleg'])
      expect(run({ gender: 'female', cityIds: ['moscow'] })).toEqual([])
    })

    it('сочетает поиск, пол и навыки', () => {
      expect(
        run({ gender: 'male', purpose: 'learn', categoryIds: ['creativity'] }, 'барабан'),
      ).toEqual(['oleg'])
    })
  })

  describe('пустой результат', () => {
    it('возвращает пустой массив, если никто не подошёл', () => {
      expect(run({}, 'такого навыка нет')).toEqual([])
    })
  })

  describe('неизменяемость', () => {
    it('не меняет переданные данные', () => {
      const frozenUsers = Object.freeze(users.map((user) => Object.freeze({ ...user })))
      const frozenFilters = Object.freeze({
        ...DEFAULT_VALUES,
        categoryIds: Object.freeze(['languages']) as string[],
      })

      expect(() =>
        filterUsers({
          users: frozenUsers as User[],
          filters: frozenFilters,
          search: 'а',
          skills: Object.freeze([...skills]) as Skill[],
          categories: Object.freeze([...categories]) as Category[],
        }),
      ).not.toThrow()
      expect(users).toHaveLength(3)
    })
  })
})
