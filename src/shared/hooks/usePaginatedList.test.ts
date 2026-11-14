import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePaginatedList } from './usePaginatedList'

const makeItems = (count: number): number[] => Array.from({ length: count }, (_, i) => i + 1)
const items10 = makeItems(10)
const items4 = makeItems(4)

describe('usePaginatedList', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('сначала показывает pageSize элементов', () => {
    const { result } = renderHook(() => usePaginatedList(items10, { pageSize: 3 }))

    expect(result.current.visibleItems).toEqual([1, 2, 3])
    expect(result.current.hasMore).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('не добавляет элементы сразу после loadMore, только после задержки', () => {
    const { result } = renderHook(() => usePaginatedList(items10, { pageSize: 3 }))

    act(() => result.current.loadMore())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.visibleItems).toHaveLength(3)

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current.visibleItems).toHaveLength(3)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current.visibleItems).toEqual([1, 2, 3, 4, 5, 6])
    expect(result.current.isLoading).toBe(false)
  })

  it('использует переданную задержку', () => {
    const { result } = renderHook(() => usePaginatedList(items10, { pageSize: 3, delay: 200 }))

    act(() => result.current.loadMore())
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current.visibleItems).toHaveLength(6)
  })

  it('повторный loadMore во время загрузки ничего не добавляет', () => {
    const { result } = renderHook(() => usePaginatedList(items10, { pageSize: 3 }))

    act(() => result.current.loadMore())
    act(() => result.current.loadMore())
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.visibleItems).toHaveLength(6)
  })

  it('когда элементы закончились, hasMore равен false и loadMore ничего не делает', () => {
    const { result } = renderHook(() => usePaginatedList(items4, { pageSize: 3 }))

    act(() => result.current.loadMore())
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.visibleItems).toEqual([1, 2, 3, 4])
    expect(result.current.hasMore).toBe(false)

    act(() => result.current.loadMore())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.visibleItems).toHaveLength(4)
  })

  it('при смене items показ начинается заново с первой порции', () => {
    const { result, rerender } = renderHook(
      ({ items }) => usePaginatedList(items, { pageSize: 3 }),
      { initialProps: { items: items10 } },
    )

    act(() => result.current.loadMore())
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.visibleItems).toHaveLength(6)

    rerender({ items: [10, 20, 30, 40, 50] })

    expect(result.current.visibleItems).toEqual([10, 20, 30])
    expect(result.current.hasMore).toBe(true)
  })

  it('при смене items незавершённая загрузка отменяется', () => {
    const { result, rerender } = renderHook(
      ({ items }) => usePaginatedList(items, { pageSize: 3 }),
      { initialProps: { items: items10 } },
    )

    act(() => result.current.loadMore())
    rerender({ items: [1, 2, 3, 4, 5, 6, 7, 8] })

    expect(result.current.isLoading).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.visibleItems).toHaveLength(3)
  })

  it('очищает таймер при размонтировании', () => {
    const { result, unmount } = renderHook(() => usePaginatedList(items10, { pageSize: 3 }))

    const timersBefore = vi.getTimerCount()

    act(() => result.current.loadMore())
    expect(vi.getTimerCount()).toBe(timersBefore + 1)

    unmount()

    expect(vi.getTimerCount()).toBe(timersBefore)
  })
})
