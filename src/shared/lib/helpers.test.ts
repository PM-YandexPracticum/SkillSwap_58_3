import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getAgeFromBirthDate } from './helpers'

describe('getAgeFromBirthDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 20, 12))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    ['1992-05-21', 33],
    ['1992-05-20', 34],
    ['1992-05-19', 34],
    ['1992-06-01', 33],
    ['1992-04-30', 34],
    ['2026-05-20', 0],
  ])('returns full years for %s: %i', (birthday, expected) => {
    expect(getAgeFromBirthDate(birthday)).toBe(expected)
  })

  it.each([
    '',
    'not a date',
    '1992',
    '1992-05',
    '20.05.1992',
    '1992/05/20',
    '1992-5-20',
    '1992-05-2',
    '1992-05-20-extra',
    '1992-05-20T00:00:00Z',
    ' 1992-05-20',
    '1992-05-20 ',
    '1992-05-20\n',
    '1992-00-20',
    '1992-13-20',
    '1992-05-00',
    '1992-05-32',
    '1992-02-31',
    '1992-04-31',
    '2025-02-29',
    '1900-02-29',
  ])('returns zero for the invalid date %j', (birthday) => {
    expect(getAgeFromBirthDate(birthday)).toBe(0)
  })

  it('returns zero for an invalid Date object', () => {
    expect(getAgeFromBirthDate(new Date(NaN))).toBe(0)
  })

  it.each(['2026-05-21', '2026-12-31', '2027-01-01'])(
    'returns zero for %s in the future',
    (birthday) => {
      expect(getAgeFromBirthDate(birthday)).toBe(0)
    },
  )

  it('accepts a Date without considering its time or mutating it', () => {
    const birthday = new Date(1992, 4, 20, 23, 59, 59)
    const timestamp = birthday.getTime()

    expect(getAgeFromBirthDate(birthday)).toBe(34)
    expect(birthday.getTime()).toBe(timestamp)
  })

  it('returns zero for a future Date object', () => {
    expect(getAgeFromBirthDate(new Date(2027, 4, 20))).toBe(0)
  })

  it.each([
    [new Date(2025, 1, 28), 24],
    [new Date(2025, 2, 1), 25],
    [new Date(2024, 1, 28), 23],
    [new Date(2024, 1, 29), 24],
  ])('handles a leap-day birthday on %s', (today, expected) => {
    vi.setSystemTime(today)

    expect(getAgeFromBirthDate('2000-02-29')).toBe(expected)
  })

  it.each([
    ['0000-01-01', 2026],
    ['0004-02-29', 2022],
    ['0099-05-20', 1927],
  ])('preserves the year in %s', (birthday, expected) => {
    expect(getAgeFromBirthDate(birthday)).toBe(expected)
  })

  it.each([
    [new Date(2026, 0, 1, 0), '2000-01-01', 26],
    [new Date(2026, 0, 1, 0), '2000-12-31', 25],
    [new Date(2026, 11, 31, 23, 59), '2000-12-31', 26],
  ])('uses the local calendar date on %s for %s', (today, birthday, expected) => {
    vi.setSystemTime(today)

    expect(getAgeFromBirthDate(birthday)).toBe(expected)
  })
})
