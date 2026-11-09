import { cloneElement, useEffect, useId, useRef } from 'react'
import clsx from 'clsx'
import type { DropdownProps } from './interface'
import styles from './Dropdown.module.css'

export function Dropdown({
  trigger,
  isOpen,
  onClose,
  children,
  className,
  panelClassName,
  ariaLabel,
}: DropdownProps) {
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onClose()
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      event.stopPropagation()
      onClose()
      rootRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="${panelId}"]`)?.focus()
    }

    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen, onClose, panelId])

  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, className)}
      onBlur={(event) => {
        if (isOpen && !event.currentTarget.contains(event.relatedTarget as Node | null)) onClose()
      }}
    >
      {cloneElement(trigger, { 'aria-expanded': isOpen, 'aria-controls': panelId })}
      <div
        id={panelId}
        className={clsx(styles.panel, panelClassName)}
        role="group"
        aria-label={ariaLabel}
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  )
}
