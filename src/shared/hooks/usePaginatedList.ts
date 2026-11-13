import { useCallback, useEffect, useRef, useState } from 'react'

type PaginatedListOptions = {
  pageSize: number
  delay?: number
}

type PaginatedList<T> = {
  visibleItems: T[]
  hasMore: boolean
  isLoading: boolean
  loadMore: () => void
}

export function usePaginatedList<T>(
  items: T[],
  { pageSize, delay = 1000 }: PaginatedListOptions,
): PaginatedList<T> {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    clearTimer()
    setVisibleCount(pageSize)
    setIsLoading(false)
  }, [items, pageSize, clearTimer])

  useEffect(() => clearTimer, [clearTimer])

  const hasMore = visibleCount < items.length

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setVisibleCount((count) => count + pageSize)
      setIsLoading(false)
    }, delay)
  }, [isLoading, hasMore, pageSize, delay])

  return {
    visibleItems: items.slice(0, visibleCount),
    hasMore,
    isLoading,
    loadMore,
  }
}
