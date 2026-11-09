import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import type { MultiSelectProps } from './interface'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Icon } from '@/shared/ui/icons'
import styles from './MultiSelect.module.css'

export const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите значение',
  label,
  defaultOpen = false,
  disabled = false,
  id,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (disabled) {
      setIsOpen(false)
    }
  }, [disabled])

  useEffect(() => {
    if (!isOpen || disabled) return

    const handleClickOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleClickOutside)

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [isOpen, disabled])

  const toggleOption = (optionValue: string) => {
    if (disabled) return
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen || disabled) return

    if (event.key === 'Escape') {
      setIsOpen(false)
      triggerRef.current?.focus()
      return
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    const checkboxes = Array.from(
      containerRef.current?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]') ?? [],
    )

    if (checkboxes.length === 0) return

    const index = checkboxes.indexOf(document.activeElement as HTMLInputElement)

    if (event.key === 'ArrowDown') {
      checkboxes[index + 1]?.focus()
    }

    if (event.key === 'ArrowUp') {
      if (index === -1) {
        checkboxes[checkboxes.length - 1]?.focus()
      } else {
        checkboxes[index - 1]?.focus()
      }
    }

    event.preventDefault()
  }

  return (
    <div ref={containerRef} className={styles.container} onKeyDown={handleKeyDown}>
      {label && (
        <label className={styles.label} htmlFor={triggerId}>
          {label}
        </label>
      )}

      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value.length === 0 ? styles.placeholder : undefined}>
          {value.length > 0 ? `Выбрано: ${value.length}` : placeholder}
        </span>

        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} />
      </button>

      {isOpen && !disabled && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div key={option.value} className={styles.option}>
              <Checkbox
                label={option.label}
                checked={value.includes(option.value)}
                onChange={() => toggleOption(option.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
