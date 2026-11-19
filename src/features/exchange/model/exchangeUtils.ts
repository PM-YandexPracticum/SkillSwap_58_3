import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { StoredNotification, SwapRequest } from '@/shared/types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isId(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isRequest(value: unknown): value is SwapRequest {
  return (
    isRecord(value) &&
    isId(value.id) &&
    isId(value.skillId) &&
    isId(value.fromUserId) &&
    isId(value.toUserId) &&
    ['pending', 'accepted', 'rejected', 'inProgress', 'done'].includes(value.status as string) &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  )
}

function isNotification(value: unknown): value is StoredNotification {
  return (
    isRecord(value) &&
    isId(value.id) &&
    isId(value.userId) &&
    isId(value.skillId) &&
    typeof value.text === 'string' &&
    typeof value.description === 'string' &&
    typeof value.dateLabel === 'string' &&
    typeof value.isNew === 'boolean'
  )
}

function readItems<T>(key: string, isItem: (value: unknown) => value is T): T[] {
  try {
    const raw = localStorage.getItem(key)
    const parsed: unknown = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? parsed.filter(isItem) : []
  } catch {
    return []
  }
}

function saveItems<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {
    // Недоступное хранилище не должно прерывать обновление состояния Redux.
  }
}

export function getStoredRequests(): SwapRequest[] {
  return readItems(LOCAL_STORAGE_KEYS.REQUESTS, isRequest)
}

export function saveRequests(requests: SwapRequest[]): void {
  saveItems(LOCAL_STORAGE_KEYS.REQUESTS, requests)
}

export function getStoredNotifications(): StoredNotification[] {
  return readItems(LOCAL_STORAGE_KEYS.NOTIFICATIONS, isNotification)
}

export function saveNotifications(notifications: StoredNotification[]): void {
  saveItems(LOCAL_STORAGE_KEYS.NOTIFICATIONS, notifications)
}
