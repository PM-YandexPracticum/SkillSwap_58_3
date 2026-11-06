export interface ImageUploadProps {
  files: File[]
  /** Получает полный список файлов после добавления новых изображений. */
  onChange: (files: File[]) => void
  error?: string
  onRemove: (index: number) => void
}
