import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProfilePage } from './useProfilePage'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

vi.mock('@/api/users', () => ({
  fetchUserById: vi.fn().mockResolvedValue({
    id: '1',
    email: 'test@mail.com',
    name: 'Test',
  }),
}))

describe('useProfilePage', () => {
  beforeEach(() => {
    localStorage.clear()

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.AUTH_USER,
      JSON.stringify({ id: '1', name: 'Test', email: 'test@mail.com', token: 'token' }),
    )
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.REGISTERED_USERS,
      JSON.stringify([
        {
          id: '1',
          email: 'test@mail.com',
          name: 'Test',
          password: 'password123',
          birthday: '01.01.2000',
          gender: 'unspecified',
          town: 'Helsinki',
          description: '',
          avatarUrl: null,
        },
      ]),
    )
  })

  it('сохраняет пользователя в localStorage', async () => {
    const { result } = renderHook(() => useProfilePage())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    await act(async () => {
      await result.current.handleSave(
        {
          email: 'new@mail.com',
          name: 'New Name',
          password: 'password123',
          birthday: '01.01.2000',
          gender: 'female',
          town: 'Helsinki',
          description: 'About me',
        },
        false,
      )
    })

    const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS) || '[]')

    expect(users).toContainEqual(
      expect.objectContaining({
        name: 'New Name',
        email: 'new@mail.com',
      }),
    )
  })

  it('обновляет аватар и сохраняет его в localStorage', async () => {
    const { result } = renderHook(() => useProfilePage())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    await act(async () => {
      result.current.handleAvatarChange('data:image/png;base64,new-avatar')
    })

    const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS) || '[]')

    expect(users).toContainEqual(
      expect.objectContaining({
        id: '1',
        avatarUrl: 'data:image/png;base64,new-avatar',
      }),
    )
    expect(result.current.currentUser?.avatarUrl).toBe('data:image/png;base64,new-avatar')
  })
})
