import { describe, expect, it, vi } from 'vitest'
import { filesToDataUrls } from './filesToDataUrls'

class MockFileReader {
  result: string | null = null
  onload: (() => void) | null = null
  onerror: (() => void) | null = null

  readAsDataURL(file: File) {
    this.result = `data:${file.type};base64,${file.name}`
    setTimeout(() => this.onload?.(), 0)
  }
}

describe('filesToDataUrls', () => {
  it('возвращает пустой массив для пустого списка', async () => {
    await expect(filesToDataUrls([])).resolves.toEqual([])
  })

  it('конвертирует файлы в data URL с сохранением порядка', async () => {
    vi.stubGlobal('FileReader', MockFileReader)
    const files = [
      new File(['1'], 'first.jpg', { type: 'image/jpeg' }),
      new File(['2'], 'second.png', { type: 'image/png' }),
    ]
    await expect(filesToDataUrls(files)).resolves.toEqual([
      'data:image/jpeg;base64,first.jpg',
      'data:image/png;base64,second.png',
    ])
    vi.unstubAllGlobals()
  })

  it('отклоняет ошибку чтения', async () => {
    vi.stubGlobal(
      'FileReader',
      class {
        onerror: (() => void) | null = null
        readAsDataURL() {
          setTimeout(() => this.onerror?.(), 0)
        }
      },
    )
    await expect(filesToDataUrls([new File(['x'], 'bad.jpg')])).rejects.toThrow(
      'Ошибка чтения файла',
    )
    vi.unstubAllGlobals()
  })
})
