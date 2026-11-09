import { useState, useRef, useEffect, useId, type ChangeEvent, type KeyboardEvent } from 'react'
import clsx from 'clsx'
import { Icon } from '../icons'
import { SearchSelectProps, SearchSelectOption } from './interface'
import styles from './SearchSelect.module.css'

export const SearchSelect = ({
  label,
  value,
  onChange,
  onClear,
  placeholder,
  options,
  error,
}: SearchSelectProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLUListElement>(null)
  const inputId = useId()

  const selectedOption = options.find((option) => option.value === value)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState(selectedOption ? selectedOption.label : '')
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  useEffect(() => {
    if (!isOpen) {
      setSearch(selectedOption ? selectedOption.label : '')
      setHighlightedIndex(-1)
    }
  }, [value, selectedOption, isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch(selectedOption ? selectedOption.label : '')
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedOption])

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  )

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const activeElement = dropdownRef.current.children[highlightedIndex] as
        | HTMLElement
        | undefined
      activeElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex, isOpen])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setHighlightedIndex(-1)
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleSelect = (option: SearchSelectOption) => {
    onChange(option.value)
    setSearch(option.label)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        const selectedIdx = filteredOptions.findIndex((opt) => opt.value === value)
        setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0)
        return
      }
      if (filteredOptions.length === 0) return
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        setHighlightedIndex(filteredOptions.length - 1)
        return
      }
      if (filteredOptions.length === 0) return
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        e.preventDefault()
        handleSelect(filteredOptions[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearch(selectedOption ? selectedOption.label : '')
      setHighlightedIndex(-1)
    }
  }

  const handleClear = () => {
    setSearch('')
    setHighlightedIndex(-1)
    onClear?.()
    inputRef.current?.focus()
  }

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
    if (!isOpen) {
      inputRef.current?.focus()
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={clsx(styles.input, error && styles.inputError)}
        />

        {search.length > 0 ? (
          <button
            type="button"
            onClick={handleClear}
            className={styles.iconButton}
            aria-label="Очистить"
          >
            <Icon name="close" size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            className={styles.iconButton}
            aria-label="Открыть список"
          >
            <Icon name="chevron-down" size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <ul ref={dropdownRef} className={styles.dropdown} role="listbox">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={clsx(
                  styles.option,
                  option.value === value && styles.optionSelected,
                  index === highlightedIndex && styles.optionHighlighted,
                )}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className={styles.noOptions}>Ничего не найдено</li>
          )}
        </ul>
      )}

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}
