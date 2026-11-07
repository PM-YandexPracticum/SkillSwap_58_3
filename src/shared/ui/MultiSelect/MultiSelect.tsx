import { useState } from 'react'
import type { MultiSelectProps } from '@/shared/types'
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
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }
  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}

      <button
        type="button"
        className={styles.trigger}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value.length === 0 ? styles.placeholder : undefined}>
          {value.length > 0 ? `Выбрано: ${value.length}` : placeholder}
        </span>

        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} />
      </button>

      {isOpen && (
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
