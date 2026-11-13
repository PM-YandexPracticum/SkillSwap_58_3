import { render } from '@testing-library/react'
import { createElement } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { useInfiniteScroll } from './useInfiniteScroll'

describe('useInfiniteScroll', () => {
  it('вызывает onLoadMore, когда элемент виден', () => {
    const onLoadMore = vi.fn()

    let callback: IntersectionObserverCallback

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb
        }

        observe() {}
        disconnect() {}
      },
    )

    const Component = () => {
      const ref = useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore,
      })

      return createElement('div', { ref })
    }

    render(createElement(Component))
    callback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)

    expect(onLoadMore).toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('не вызывает onLoadMore, если больше нет данных', () => {
    const onLoadMore = vi.fn()

    const Component = () => {
      const ref = useInfiniteScroll({
        hasMore: false,
        isLoading: false,
        onLoadMore,
      })

      return createElement('div', { ref })
    }

    render(createElement(Component))

    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('не вызывает onLoadMore во время загрузки', () => {
    const onLoadMore = vi.fn()

    const Component = () => {
      const ref = useInfiniteScroll({
        hasMore: true,
        isLoading: true,
        onLoadMore,
      })

      return createElement('div', { ref })
    }

    render(createElement(Component))

    expect(onLoadMore).not.toHaveBeenCalled()
  })
})
