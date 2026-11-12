import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { fetchCategories } from '@/api/categories'
import { fetchCities } from '@/api/cities'
import type { Category, City } from '@/shared/types'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Icon } from '@/shared/ui/icons'
import { Radio } from '@/shared/ui/Radio'
import type { FilterGender, FilterPurpose, FiltersProps, FiltersValues } from './interface'
import styles from './Filters.module.css'

const VISIBLE_CITIES_COUNT = 5

const PURPOSE_OPTIONS: { value: FilterPurpose; label: string }[] = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
]

const GENDER_OPTIONS: { value: FilterGender; label: string }[] = [
  { value: 'any', label: 'Не имеет значения' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

const createDefaultValues = (): FiltersValues => ({
  purpose: 'all',
  gender: 'any',
  categoryIds: [],
  subcategoryIds: [],
  cityIds: [],
})

const toggleInList = (list: string[], id: string) =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id]

// виджет фильтров каталога (цель обмена, навыки с подкатегориями, пол автора, город)
// в шапке счётчик и кнопка сбросить при активных > 0

export const Filters = ({ onChange, className }: FiltersProps) => {
  const [values, setValues] = useState<FiltersValues>(createDefaultValues)
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isCitiesExpanded, setIsCitiesExpanded] = useState(false)
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([])

  useEffect(() => {
    let isMounted = true
    Promise.all([fetchCategories(), fetchCities()])
      .then(([categoriesData, citiesData]) => {
        if (isMounted) {
          setCategories(categoriesData)
          setCities(citiesData)
        }
      })
      .catch(() => {
        // данные моков недоступны (фильтры продолжают работать с пустыми списками)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const update = (next: Partial<FiltersValues>) => {
    const result = { ...values, ...next }
    setValues(result)
    onChange?.(result)
  }

  const activeCount =
    (values.purpose !== 'all' ? 1 : 0) +
    (values.gender !== 'any' ? 1 : 0) +
    values.categoryIds.length +
    values.subcategoryIds.length +
    values.cityIds.length

  const isCategoryActive = (category: Category) =>
    values.categoryIds.includes(category.id) ||
    category.subcategories.some((subcategory) => values.subcategoryIds.includes(subcategory.id))

  // клик по категории активна (минус) снимаем её и её подкатегории, иначе включаем
  const handleCategoryToggle = (category: Category) => {
    if (isCategoryActive(category)) {
      update({
        categoryIds: values.categoryIds.filter((id) => id !== category.id),
        subcategoryIds: values.subcategoryIds.filter(
          (id) => !category.subcategories.some((subcategory) => subcategory.id === id),
        ),
      })
    } else {
      update({ categoryIds: [...values.categoryIds, category.id] })
    }
  }

  const toggleCategoryOpen = (id: string) => setOpenCategoryIds((prev) => toggleInList(prev, id))

  const isAllCategoriesOpen = categories.length > 0 && openCategoryIds.length === categories.length

  const toggleAllCategories = () =>
    setOpenCategoryIds(isAllCategoriesOpen ? [] : categories.map((category) => category.id))

  const visibleCities = isCitiesExpanded ? cities : cities.slice(0, VISIBLE_CITIES_COUNT)

  return (
    <aside className={clsx(styles.filters, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Фильтры
          {activeCount > 0 && <span className={styles.count}> ({activeCount})</span>}
        </h2>
        {activeCount > 0 && (
          <Button
            variant="link"
            className={styles.resetButton}
            iconRight={<Icon name="close" size={16} />}
            onClick={() => update(createDefaultValues())}
          >
            Сбросить
          </Button>
        )}
      </div>

      <section className={styles.section} aria-label="Цель обмена">
        {PURPOSE_OPTIONS.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            name="filters-purpose"
            value={option.value}
            checked={values.purpose === option.value}
            onChange={(value) => update({ purpose: value as FilterPurpose })}
          />
        ))}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Навыки</h3>
        {categories.map((category) => {
          const isOpen = openCategoryIds.includes(category.id)
          return (
            <div key={category.id} className={styles.category}>
              <div className={styles.categoryRow}>
                <Checkbox
                  label={category.name}
                  indeterminate={isCategoryActive(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
                <button
                  type="button"
                  className={styles.categoryToggle}
                  aria-expanded={isOpen}
                  aria-label={
                    isOpen
                      ? `Свернуть подкатегории: ${category.name}`
                      : `Показать подкатегории: ${category.name}`
                  }
                  onClick={() => toggleCategoryOpen(category.id)}
                >
                  <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} />
                </button>
              </div>

              <div
                className={clsx(styles.subcategories, isOpen && styles.subcategoriesOpen)}
                aria-hidden={!isOpen}
              >
                <div className={styles.subcategoriesInner}>
                  {category.subcategories.map((subcategory) => (
                    <Checkbox
                      key={subcategory.id}
                      label={subcategory.name}
                      checked={values.subcategoryIds.includes(subcategory.id)}
                      onChange={() =>
                        update({
                          subcategoryIds: toggleInList(values.subcategoryIds, subcategory.id),
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
        <button
          type="button"
          className={styles.expandLink}
          aria-expanded={isAllCategoriesOpen}
          onClick={toggleAllCategories}
        >
          {isAllCategoriesOpen ? 'Скрыть' : 'Все категории'}
          <Icon name={isAllCategoriesOpen ? 'chevron-up' : 'chevron-down'} size={16} />
        </button>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Пол автора</h3>
        {GENDER_OPTIONS.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            name="filters-gender"
            value={option.value}
            checked={values.gender === option.value}
            onChange={(value) => update({ gender: value as FilterGender })}
          />
        ))}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Город</h3>
        {visibleCities.map((city) => (
          <Checkbox
            key={city.id}
            label={city.name}
            checked={values.cityIds.includes(city.id)}
            onChange={() => update({ cityIds: toggleInList(values.cityIds, city.id) })}
          />
        ))}
        {cities.length > VISIBLE_CITIES_COUNT && (
          <button
            type="button"
            className={styles.expandLink}
            aria-expanded={isCitiesExpanded}
            onClick={() => setIsCitiesExpanded((prev) => !prev)}
          >
            {isCitiesExpanded ? 'Скрыть' : 'Все города'}
            <Icon name={isCitiesExpanded ? 'chevron-up' : 'chevron-down'} size={16} />
          </button>
        )}
      </section>
    </aside>
  )
}
