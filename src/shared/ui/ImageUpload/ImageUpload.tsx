import { useId, useState } from 'react'
import clsx from 'clsx'
import { Icon } from '@/shared/ui/icons'
import type { ImageUploadProps } from './interface'
import styles from './ImageUpload.module.css'

export function ImageUpload({ files, onChange, error, onRemove }: ImageUploadProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const [isDragging, setIsDragging] = useState(false)
  const [validationError, setValidationError] = useState('')
  const errorText = error || validationError

  function addFiles(incoming: File[]) {
    if (!incoming.length) return
    if (files.length + incoming.length > 5) {
      setValidationError('Можно загрузить не более 5 изображений.')
      return
    }
    if (incoming.some((file) => !['image/jpeg', 'image/png'].includes(file.type))) {
      setValidationError('Допускаются только изображения JPEG и PNG.')
      return
    }
    if (incoming.some((file) => file.size > 2 * 1024 * 1024)) {
      setValidationError('Размер каждого изображения не должен превышать 2 МБ.')
      return
    }
    setValidationError('')
    onChange([...files, ...incoming])
  }

  return (
    <div className={styles.root}>
      <div
        className={clsx(styles.dropZone, {
          [styles.dragging]: isDragging,
          [styles.invalid]: errorText,
        })}
        onDragEnter={(event) => {
          if (event.dataTransfer.types.includes('Files')) setIsDragging(true)
        }}
        onDragOver={(event) => {
          if (!event.dataTransfer.types.includes('Files')) return
          event.preventDefault()
          event.dataTransfer.dropEffect = 'copy'
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          addFiles(Array.from(event.dataTransfer.files))
        }}
      >
        <input
          id={id}
          className={styles.input}
          type="file"
          multiple
          accept="image/jpeg,image/png"
          aria-label="Выбрать изображения"
          aria-describedby={`${hintId}${errorText ? ` ${errorId}` : ''}`}
          aria-invalid={Boolean(errorText)}
          onChange={(event) => {
            addFiles(Array.from(event.currentTarget.files ?? []))
            event.currentTarget.value = ''
          }}
        />
        <label htmlFor={id} className={styles.label}>
          <span className={styles.hint}>Перетащите или выберите изображения навыка</span>
          <span className={styles.choose}>
            <Icon name="gallery-add" focusable="false" />
            Выбрать изображения
          </span>
        </label>
        <span id={hintId} className={styles.srOnly}>
          JPEG или PNG, до 2 МБ каждый, не более 5 изображений.
        </span>
      </div>
      {errorText && (
        <p id={errorId} className={styles.error} role="alert">
          {errorText}
        </p>
      )}
      {files.length > 0 && (
        <ul className={styles.fileList} aria-label="Загруженные изображения">
          {files.map((file, index) => (
            <li className={styles.fileItem} key={`${file.name}-${index}`}>
              <span className={styles.fileName}>{file.name}</span>
              <button
                type="button"
                className={styles.removeButton}
                aria-label={`Удалить ${file.name}`}
                onClick={() => {
                  setValidationError('')
                  onRemove(index)
                }}
              >
                <Icon name="close" size={24} focusable="false" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
