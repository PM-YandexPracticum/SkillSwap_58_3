import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { User } from '@/shared/types'
import { ProfileEditForm } from './ProfileEditForm'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const mockUser: User = {
  id: 'user-01',
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  avatarUrl: '/img/avatars/avatar-01.png',
  createdAt: '2025-01-01T00:00:00Z',
  password: 'Password123!',
  town: 'moscow',
  birthday: '15.05.1990',
  likedCount: 5,
  description: 'Привет, я Иван',
  gender: 'male',
  learn: [],
  favourites: [],
}

class MockFileReader {
  result: string | null = null
  onload: (() => void) | null = null
  onerror: (() => void) | null = null

  readAsDataURL(file: File) {
    this.result = `data:${file.type};base64,${file.name}`
    setTimeout(() => this.onload?.(), 0)
  }
}

describe('ProfileEditForm', () => {
  it('отображает текущую аватарку пользователя', () => {
    render(<ProfileEditForm currentUser={mockUser} onSave={vi.fn()} />)

    const avatar = screen.getByRole('img', { name: mockUser.name })
    expect(avatar).toHaveAttribute('src', mockUser.avatarUrl)
  })

  it('отображает заглушку, если у пользователя нет аватарки', () => {
    const { container } = render(
      <ProfileEditForm currentUser={{ ...mockUser, avatarUrl: null }} onSave={vi.fn()} />,
    )

    const placeholder = screen.getByLabelText(mockUser.name)
    expect(placeholder).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('показывает ошибку, если размер файла превышает 2 МБ', async () => {
    const onAvatarChange = vi.fn()
    const { container } = render(
      <ProfileEditForm currentUser={mockUser} onSave={vi.fn()} onAvatarChange={onAvatarChange} />,
    )

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()

    const largeFile = new File(['x'.repeat(100)], 'large.png', { type: 'image/png' })
    Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 })

    fireEvent.change(fileInput, { target: { files: [largeFile] } })

    expect(screen.getByText('Максимальный размер файла — 2 МБ')).toBeInTheDocument()
    expect(onAvatarChange).not.toHaveBeenCalled()
  })

  it('вызывает onAvatarChange и обновляет аватар при выборе корректного файла', async () => {
    vi.stubGlobal('FileReader', MockFileReader)
    const onAvatarChange = vi.fn()
    const { container } = render(
      <ProfileEditForm currentUser={mockUser} onSave={vi.fn()} onAvatarChange={onAvatarChange} />,
    )

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    const validFile = new File(['valid-image-content'], 'avatar.png', { type: 'image/png' })
    Object.defineProperty(validFile, 'size', { value: 500 * 1024 })

    fireEvent.change(fileInput, { target: { files: [validFile] } })

    await waitFor(() => {
      expect(onAvatarChange).toHaveBeenCalledWith('data:image/png;base64,avatar.png')
    })

    const updatedAvatar = screen.getByRole('img', { name: mockUser.name })
    expect(updatedAvatar).toHaveAttribute('src', 'data:image/png;base64,avatar.png')
    expect(screen.queryByText('Максимальный размер файла — 2 МБ')).not.toBeInTheDocument()

    vi.unstubAllGlobals()
  })

  it('вызывает клик по скрытому инпуту при нажатии на кнопку редактирования фото', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProfileEditForm currentUser={mockUser} onSave={vi.fn()} />)

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(fileInput, 'click')

    const uploadButton = screen.getByRole('button', { name: 'Изменить фото' })
    await user.click(uploadButton)

    expect(clickSpy).toHaveBeenCalledTimes(1)
  })
})
