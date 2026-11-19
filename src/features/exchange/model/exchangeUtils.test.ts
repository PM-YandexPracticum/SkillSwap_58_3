import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { StoredNotification, SwapRequest } from '@/shared/types'
import {
  getStoredNotifications,
  getStoredRequests,
  saveNotifications,
  saveRequests,
} from './exchangeUtils'

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
  userId: 'user-2',
  skillId: request.skillId,
  text: 'Анна предлагает обмен',
  description: 'Откройте профиль, чтобы посмотреть навыки',
  dateLabel: '16 ноября',
  isNew: true,
}

function createStorage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() {
      return values.size
    },
    clear: vi.fn(() => values.clear()),
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(values.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => {
      values.delete(key)
    }),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value)
    }),
  }
}

let storage: Storage

beforeEach(() => {
  storage = createStorage()
  vi.stubGlobal('localStorage', storage)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe.each([
  {
    name: 'заявки',
    key: LOCAL_STORAGE_KEYS.REQUESTS,
    record: request,
    read: getStoredRequests,
    save: () => saveRequests([request]),
    invalid: [
      { ...request, id: '' },
      { ...request, skillId: 1 },
      { ...request, fromUserId: null },
      { ...request, toUserId: ' ' },
      { ...request, status: 'unknown' },
      { ...request, createdAt: 1 },
      { ...request, updatedAt: null },
    ],
  },
  {
    name: 'уведомления',
    key: LOCAL_STORAGE_KEYS.NOTIFICATIONS,
    record: notification,
    read: getStoredNotifications,
    save: () => saveNotifications([notification]),
    invalid: [
      { ...notification, id: ' ' },
      { ...notification, userId: null },
      { ...notification, skillId: 1 },
      { ...notification, text: null },
      { ...notification, description: [] },
      { ...notification, dateLabel: 1 },
      { ...notification, isNew: 'true' },
    ],
  },
])('exchangeUtils: $name', ({ key, record, read, save, invalid }) => {
  it('сохраняет и восстанавливает записи, не меняя другие ключи', () => {
    storage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, 'existing-session')

    save()

    expect(storage.getItem(key)).toBe(JSON.stringify([record]))
    expect(read()).toEqual([record])
    expect(storage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBe('existing-session')
  })

  it('возвращает пустой список без сохранённых данных', () => {
    expect(read()).toEqual([])
  })

  it('возвращает пустой список для повреждённого JSON и неверного контейнера', () => {
    for (const value of ['{broken', '{}', 'null', '"text"', '42']) {
      storage.setItem(key, value)

      expect(read()).toEqual([])
    }
  })

  it('пропускает некорректные записи, сохраняя валидные', () => {
    storage.setItem(key, JSON.stringify([null, [], {}, ...invalid, record]))

    expect(read()).toEqual([record])
  })

  it('возвращает пустой список при ошибке чтения', () => {
    vi.mocked(storage.getItem).mockImplementationOnce(() => {
      throw new Error('Storage unavailable')
    })

    expect(read()).toEqual([])
  })

  it('не выбрасывает ошибку записи и сохраняет предыдущие данные', () => {
    storage.setItem(key, '[]')
    vi.mocked(storage.setItem).mockImplementationOnce(() => {
      throw new Error('Storage is full')
    })

    expect(save).not.toThrow()
    expect(storage.getItem(key)).toBe('[]')
  })

  it('без localStorage безопасно читает и пытается сохранить данные', () => {
    vi.stubGlobal('localStorage', undefined)

    expect(read()).toEqual([])
    expect(save).not.toThrow()
  })
})

it('сохраняет пустые списки при удалении всех заявок и уведомлений', () => {
  saveRequests([request])
  saveNotifications([notification])

  saveRequests([])
  saveNotifications([])

  expect(getStoredRequests()).toEqual([])
  expect(getStoredNotifications()).toEqual([])
})
