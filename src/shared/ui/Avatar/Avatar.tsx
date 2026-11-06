import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import { Icon } from '@/shared/ui/icons'
import type { AvatarEditAction, AvatarProps } from './interface'
import styles from './Avatar.module.css'

export function Avatar({ size = 'medium', src, alt = '', onAdd, onEdit }: AvatarProps) {
  const popupId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const editRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [isOpen])

  function choose(action: AvatarEditAction) {
    setIsOpen(false)
    editRef.current?.focus()
    onEdit?.(action)
  }

  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, styles[size])}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          event.preventDefault()
          event.stopPropagation()
          setIsOpen(false)
          editRef.current?.focus()
        }
      }}
    >
      {src ? (
        <img className={styles.image} src={src} alt={alt} />
      ) : (
        <span
          className={styles.placeholder}
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
        >
          <Icon name="user-circle" focusable="false" />
        </span>
      )}
      {!src && onAdd && (
        <button
          type="button"
          className={clsx(styles.actionButton, styles.addButton)}
          aria-label="Добавить фото"
          onClick={onAdd}
        >
          <Icon name="plus" focusable="false" />
        </button>
      )}
      {onEdit && (src || !onAdd) && (
        <>
          <button
            ref={editRef}
            type="button"
            className={clsx(styles.actionButton, styles.editButton)}
            aria-label="Редактировать фото"
            aria-expanded={isOpen}
            aria-controls={popupId}
            onClick={() => setIsOpen((open) => !open)}
          >
            <Icon name="edit" focusable="false" />
          </button>
          <div
            id={popupId}
            className={styles.popup}
            role="group"
            aria-label="Действия с фото"
            hidden={!isOpen}
          >
            <button type="button" className={styles.popupButton} onClick={() => choose('edit')}>
              Изменить
            </button>
            <button
              type="button"
              className={styles.popupButton}
              disabled={!src}
              onClick={() => choose('delete')}
            >
              Удалить
            </button>
          </div>
        </>
      )}
    </div>
  )
}
