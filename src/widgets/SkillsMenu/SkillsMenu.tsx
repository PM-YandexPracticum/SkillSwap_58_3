import { useEffect, useState } from 'react'
import { fetchCategories } from '@/api/categories'
import type { Category } from '@/shared/types'
import { useSelectSubcategory } from '@/store/useSelectSubcategory'
import { CategoriesList } from '@/widgets/CategoriesList'
import type { SkillsMenuProps } from './interface'
import styles from './SkillsMenu.module.css'

const LOAD_ERROR_TEXT = 'Не удалось загрузить навыки. Обновите страницу и попробуйте ещё раз.'

// все категории и подкатегории навыков; клик по подкатегории фильтрует каталог
export const SkillsMenu = ({ onSelect }: SkillsMenuProps) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [hasError, setHasError] = useState(false)
  const selectSubcategory = useSelectSubcategory(onSelect)

  useEffect(() => {
    let isActive = true
    fetchCategories()
      .then((loaded) => {
        if (isActive) setCategories(loaded)
      })
      .catch(() => {
        if (isActive) setHasError(true)
      })
    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className={styles.root}>
      {hasError ? (
        <p className={styles.error} role="alert">
          {LOAD_ERROR_TEXT}
        </p>
      ) : (
        <CategoriesList categories={categories} onSelectSubcategory={selectSubcategory} />
      )}
    </div>
  )
}
