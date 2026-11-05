import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import type { AvatarEditAction, AvatarProps } from './interface'
import styles from './Avatar.module.css'

export function Avatar({ size = 'medium', src, alt, onAdd, onEdit }: AvatarProps) {
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
          {/* TODO(#25): заменить временную SVG общей иконкой пользователя. */}
          <svg
            viewBox="0 0 72 72"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="36" cy="36" r="30" />
            <circle cx="36" cy="26" r="10" />
            <path d="M16 58c2-12 9-18 20-18s18 6 20 18" />
          </svg>
        </span>
      )}
      {!src && onAdd && (
        <button
          type="button"
          className={clsx(styles.actionButton, styles.addButton)}
          aria-label="Добавить фото"
          onClick={onAdd}
        >
          {/* TODO(#25): заменить временную SVG плюса общей иконкой добавления. */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
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
            aria-controls={isOpen ? popupId : undefined}
            onClick={() => setIsOpen((open) => !open)}
          >
            {/* TODO(#25): заменить временную SVG карандаша общей иконкой редактирования. */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m4 17 13-13 3 3L7 20H4v-3Zm10-10 3 3" />
            </svg>
          </button>
          {isOpen && (
            <div id={popupId} className={styles.popup} role="group" aria-label="Действия с фото">
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
          )}
        </>
      )}
    </div>
  )
}
