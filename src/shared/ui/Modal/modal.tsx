import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import type { ModalProps } from './type'
import styles from './modal.module.css'

const openPanels: HTMLElement[] = []
let previousOverflow = ''
const focusableSelector =
  'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]'

export function Modal({
  isOpen,
  onClose,
  className,
  width = 556,
  height,
  children,
  ariaLabel = 'Диалоговое окно',
  ariaLabelledBy,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const panel = panelRef.current
    if (!panel) return
    const previousFocus = document.activeElement
    if (openPanels.length === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    openPanels.push(panel)
    const isTopPanel = () => openPanels[openPanels.length - 1] === panel
    const getFocusableElements = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) =>
          element.tabIndex >= 0 &&
          !element.matches(':disabled') &&
          !element.closest('[hidden], [inert], [aria-hidden="true"]') &&
          getComputedStyle(element).display !== 'none' &&
          getComputedStyle(element).visibility !== 'hidden',
      )
    const focusInside = () => {
      const target =
        panel.scrollHeight > panel.clientHeight ? panel : (getFocusableElements()[0] ?? panel)
      target.focus()
    }
    focusInside()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopPanel()) return
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onCloseRef.current()
      }
      if (event.key !== 'Tab') return
      const elements = getFocusableElements()
      const first = elements[0]
      const last = elements[elements.length - 1]
      const active = document.activeElement
      if (!first || !panel.contains(active) || active === panel) {
        event.preventDefault()
        const target = (event.shiftKey ? last : first) ?? panel
        target.focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const handleFocusIn = (event: FocusEvent) => {
      if (isTopPanel() && event.target instanceof Node && !panel.contains(event.target)) {
        focusInside()
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      const wasTopPanel = isTopPanel()
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('focusin', handleFocusIn)
      openPanels.splice(openPanels.indexOf(panel), 1)
      if (openPanels.length === 0) document.body.style.overflow = previousOverflow
      if (wasTopPanel && previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (
          event.target === event.currentTarget &&
          openPanels[openPanels.length - 1] === panelRef.current
        ) {
          onClose()
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        className={clsx(styles.panel, className)}
        style={{ width, height }}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
