import type { KeyboardEvent } from 'react'
import { SearchInputProps } from './types'
import styles from './SearchInput.module.css'
import { Input } from '../Input'

export const SearchInput = ({
  value,
  placeholder,
  onChange,
  onClear,
  onSearch,
}: SearchInputProps) => {
  const hasText = value.length > 0

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className={styles.searchContainer} onKeyDown={handleKeyDown}>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        iconLeft="search"
        iconRight={hasText ? 'close' : undefined}
        onRightIconClick={onClear}
        label=""
      />

      <button
        type="button"
        className={styles.searchClickableArea}
        onClick={onSearch}
        aria-label="искать"
      />
    </div>
  )
}
