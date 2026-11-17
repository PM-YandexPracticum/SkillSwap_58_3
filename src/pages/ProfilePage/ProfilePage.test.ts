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
  })

  it('сохраняет пользователя в localStorage', async () => {
    const { result } = renderHook(() => useProfilePage())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.handleSave(
        {
          email: 'new@mail.com',
          name: 'New Name',
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
})
