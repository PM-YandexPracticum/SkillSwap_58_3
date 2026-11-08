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
  const inputId = useId()

  const selectedOption = options.find((option) => option.value === value)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState(selectedOption ? selectedOption.label : '')

  useEffect(() => {
    if (!isOpen) {
      setSearch(selectedOption ? selectedOption.label : '')
    }
  }, [value, selectedOption, isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch(selectedOption ? selectedOption.label : '')
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setSearch(selectedOption ? selectedOption.label : '')
    }
  }

  const handleSelect = (option: SearchSelectOption) => {
    onChange(option.value)
    setSearch(option.label)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSearch('')
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
        <ul className={styles.dropdown} role="listbox">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={clsx(styles.option, option.value === value && styles.optionSelected)}
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
