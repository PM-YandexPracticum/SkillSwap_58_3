import { describe, expect, it } from 'vitest'
import { maskDate } from './maskDate'

describe('maskDate', () => {
  it('returns empty string for empty input', () => {
    expect(maskDate('')).toBe('')
  })

  it('removes everything except digits', () => {
    expect(maskDate('a1b2-c3')).toBe('12.3')
  })

  it('does not add a separator after a complete day or month', () => {
    expect(maskDate('12')).toBe('12')
    expect(maskDate('1204')).toBe('12.04')
  })

  it('splits digits into dd.mm.yyyy', () => {
    expect(maskDate('27041995')).toBe('27.04.1995')
  })

  it('keeps already formatted value unchanged', () => {
    expect(maskDate('27.04.1995')).toBe('27.04.1995')
  })

  it('drops digits beyond the eight allowed', () => {
    expect(maskDate('270419951234')).toBe('27.04.1995')
  })

  it('lets the user delete a trailing separator', () => {
    expect(maskDate('12.')).toBe('12')
  })
})
