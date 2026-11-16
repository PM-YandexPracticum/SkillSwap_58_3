import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { StoredNotification, SwapRequest } from '@/shared/types'

const request: SwapRequest = {
  id: 'request-1',
  skillId: 'skill-1',
  fromUserId: 'user-1',
  toUserId: 'user-2',
  status: 'pending',
  createdAt: '2026-11-16T10:00:00.000Z',
  updatedAt: '2026-11-16T10:00:00.000Z',
}
const notification: StoredNotification = {
  id: 'notification-1',
  userId: request.toUserId,
  skillId: request.skillId,
  text: 'Анна предлагает вам обмен',
  description: 'Примите обмен, чтобы обсудить детали',
  dateLabel: '16 ноября',
  isNew: true,
}

let storage: Storage

beforeEach(() => {
  vi.resetModules()
  const values = new Map<string, string>()
  storage = {
    get length() {
      return values.size
    },
    key: (index) => [...values.keys()][index] ?? null,
    getItem: (key) => values.get(key) ?? null,
    setItem: vi.fn((key, value) => {
      values.set(key, value)
    }),
    removeItem: (key) => {
      values.delete(key)
    },
    clear: () => values.clear(),
  }
  vi.stubGlobal('localStorage', storage)
})

afterEach(() => vi.unstubAllGlobals())

it('сохраняет exchange после действий и восстанавливает его при создании нового store', async () => {
  const { store } = await import('./index')
  const { exchangeProposed, markAllRead, clearViewed } =
    await import('@/features/exchange/model/exchangeSlice')
  store.dispatch(exchangeProposed({ request, notification }))
  expect(JSON.parse(storage.getItem(LOCAL_STORAGE_KEYS.REQUESTS) ?? 'null')).toEqual([request])
  expect(JSON.parse(storage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS) ?? 'null')).toEqual([
    notification,
  ])

  store.dispatch(markAllRead(notification.userId))
  vi.resetModules()
  const { store: restoredStore } = await import('./index')
  expect(restoredStore.getState().exchange).toEqual({
    requests: [request],
    notifications: [{ ...notification, isNew: false }],
  })
  restoredStore.dispatch(clearViewed(notification.userId))
  expect(storage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS)).toBe('[]')
  expect(JSON.parse(storage.getItem(LOCAL_STORAGE_KEYS.REQUESTS) ?? 'null')).toEqual([request])
})

it('не перезаписывает exchange при изменениях авторизации и неизвестных действиях', async () => {
  const { store } = await import('./index')
  const { setAuthUser } = await import('@/features/auth/model/authSlice')
  expect(store.getState().exchange).toEqual({ requests: [], notifications: [] })
  store.dispatch(
    setAuthUser({ id: 'user-1', name: 'Анна', email: 'anna@example.com', token: 'mock' }),
  )
  store.dispatch({ type: 'unrelated/action' })
  expect(storage.setItem).not.toHaveBeenCalled()
})
