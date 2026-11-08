import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import clsx from 'clsx'
import { Icon } from '@/shared/ui/icons'
import type { SelectOption, SelectProps } from './type'
import styles from './Select.module.css'

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Не выбран',
  label,
  disabled = false,
  id: providedId,
}: SelectProps) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const listId = `${id}-list`
  const rootRef = useRef<HTMLDivElement | null>(null)
  const controlRef = useRef<HTMLButtonElement | null>(null)
  const activeRef = useRef<HTMLLIElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = options[selectedIndex]
  const highlightedIndex = Math.max(0, Math.min(activeIndex, options.length - 1))
  const active = options[highlightedIndex]

  useEffect(() => {
    if (!isOpen) return
    if (disabled) {
      setIsOpen(false)
      return
    }
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [isOpen, disabled])

  useEffect(() => {
    if (isOpen) activeRef.current?.scrollIntoView?.({ block: 'nearest' })
  }, [isOpen, highlightedIndex, options])

  function open() {
    setIsOpen(true)
    setActiveIndex(Math.max(selectedIndex, 0))
  }

  function choose(option: SelectOption) {
    setIsOpen(false)
    controlRef.current?.focus()
    if (option.value !== value) onChange(option.value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      event.stopPropagation()
      if (!isOpen) {
        open()
        if (event.key === 'ArrowUp' && !selected) setActiveIndex(options.length - 1)
      } else if (options.length) {
        const direction = event.key === 'ArrowDown' ? 1 : -1
        setActiveIndex((highlightedIndex + direction + options.length) % options.length)
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      if (!isOpen) open()
      else if (active) choose(active)
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault()
        event.stopPropagation()
      }
      setIsOpen(false)
    }
  }

  return (
    <div className={styles.root} ref={rootRef}>
      {label && (
        <label className={styles.label} htmlFor={id} id={`${id}-label`}>
          {label}
        </label>
      )}
      <button
        ref={controlRef}
        id={id}
        type="button"
        disabled={disabled}
        role="combobox"
        aria-label={label ? undefined : placeholder}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-activedescendant={isOpen && active ? `${listId}-${highlightedIndex}` : undefined}
        className={clsx(styles.control, { [styles.expanded]: isOpen })}
        onClick={() => {
          if (isOpen) setIsOpen(false)
          else open()
        }}
        onKeyDown={handleKeyDown}
      >
        <span className={selected ? undefined : styles.placeholder}>
          {selected?.label ?? placeholder}
        </span>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} focusable="false" />
      </button>
      {isOpen && (
        <ul
          className={styles.list}
          id={listId}
          role="listbox"
          aria-labelledby={label ? `${id}-label` : undefined}
          aria-label={label ? undefined : placeholder}
        >
          {options.length ? (
            options.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                ref={index === highlightedIndex ? activeRef : undefined}
                role="option"
                aria-selected={option.value === value}
                className={clsx(styles.option, {
                  [styles.selected]: option.value === value,
                  [styles.active]: index === highlightedIndex,
                })}
                onPointerDown={(event) => event.preventDefault()}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => choose(option)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className={styles.empty} role="presentation">
              Нет вариантов
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
