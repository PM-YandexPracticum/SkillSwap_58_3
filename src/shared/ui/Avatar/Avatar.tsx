import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Dropdown } from '@/shared/ui/Dropdown'
import { Icon } from '@/shared/ui/icons'
import type { AvatarEditAction, AvatarProps } from './interface'
import styles from './Avatar.module.css'

export function Avatar({ size = 'medium', src, alt = '', onAdd, onEdit }: AvatarProps) {
  const editRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  function choose(action: AvatarEditAction) {
    setIsOpen(false)
    editRef.current?.focus()
    onEdit?.(action)
  }

  return (
    <div className={clsx(styles.root, styles[size])}>
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
        <Dropdown
          className={styles.editDropdown}
          panelClassName={styles.popup}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          ariaLabel="Действия с фото"
          trigger={
            <button
              ref={editRef}
              type="button"
              className={clsx(styles.actionButton, styles.editButton)}
              aria-label="Редактировать фото"
              onClick={() => setIsOpen((open) => !open)}
            >
              <Icon name="edit" focusable="false" />
            </button>
          }
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
        </Dropdown>
      )}
    </div>
  )
}
