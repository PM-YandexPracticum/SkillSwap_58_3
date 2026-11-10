import { describe, expect, it } from 'vitest'
import { formatAge } from './formatAge'

describe('formatAge', () => {
  it.each([
    [1, '1 год'],
    [21, '21 год'],
    [101, '101 год'],
    [2, '2 года'],
    [34, '34 года'],
    [44, '44 года'],
    [5, '5 лет'],
    [20, '20 лет'],
    [25, '25 лет'],
    [30, '30 лет'],
    [100, '100 лет'],
  ])('writes %i as «%s»', (age, expected) => {
    expect(formatAge(age)).toBe(expected)
  })

  it.each([11, 12, 13, 14, 111, 112])('uses «лет» for %i despite the last digit', (age) => {
    expect(formatAge(age)).toBe(`${age} лет`)
  })
})
