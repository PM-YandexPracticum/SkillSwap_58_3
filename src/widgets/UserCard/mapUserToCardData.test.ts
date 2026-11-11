import userFixture from '../../../public/db/users.json'
import { mapUserToCardData } from './mapUserToCardData'
import { Category, User } from '@/shared/types'
import { Dictionaries } from './types'
import { describe, it, expect } from 'vitest'

const user1 = userFixture[0] as unknown as User

const makeCategories = (): Category[] => [
  {
    id: 'home' as Category['id'],
    name: 'Дом и уют',
    subcategories: [
      { id: 'home-houseplants' as Category['subcategories'][0]['id'], name: 'Комнатные растения' },
      { id: 'home-finances' as Category['subcategories'][0]['id'], name: 'Личные финансы' },
      { id: 'home-cleaning' as Category['subcategories'][0]['id'], name: 'Уборка' },
    ],
  },
]

const makeEmptyDict = (): Dictionaries =>
  ({
    cities: [],
    categories: [],
    skills: [],
  }) as Dictionaries

const makeDictionaries = (): Dictionaries =>
  ({
    cities: [{ id: 'moscow', name: 'Москва' }],
    categories: makeCategories(),
    skills: [],
  }) as Dictionaries

describe('mapUserToCardData', () => {
  it('маппит фикстурного пользователя полностью', () => {
    const result = mapUserToCardData(user1, makeDictionaries(), new Date(2026, 0, 10))

    expect(result).toEqual({
      id: 'user-01',
      name: 'Иван Петров',
      avatarUrl: '/img/avatars/avatar-01.png',
      description: 'Практик, а не теоретик: покажу на примерах, как это работает.',
      city: 'Москва',
      age: 33,
      teach: [],
      learn: [
        { id: 'home-houseplants', label: 'Комнатные растения', categoryId: 'home' },
        { id: 'home-finances', label: 'Личные финансы', categoryId: 'home' },
      ],
    })
  })

  it('Если нет города вернет пустую строку', () => {
    const result = mapUserToCardData(user1, makeEmptyDict(), new Date(2026, 0, 10))

    expect(result?.city).toEqual('')
  })

  it('Если есть id города то вернет город', () => {
    const result = mapUserToCardData(user1, makeDictionaries(), new Date(2026, 0, 10))

    expect(result?.city).toBe('Москва')
  })

  it('learn: пропускает подкатегорию, которой нет в словаре', () => {
    const result = mapUserToCardData(
      { ...user1, learn: ['home-houseplants', 'ghost-id'] },
      makeDictionaries(),
    )
    expect(result?.learn).toHaveLength(1)
  })

  it('learn: пустой массив, если у пользователя нет подкатегорий', () => {
    const result = mapUserToCardData({ ...user1, learn: [] }, makeDictionaries())
    expect(result?.learn).toEqual([])
  })

  it('favourites не попадает в карточку', () => {
    const result = mapUserToCardData(user1, makeDictionaries())
    expect(result).not.toHaveProperty('favourites')
    expect(result).not.toHaveProperty('password')
  })
})
