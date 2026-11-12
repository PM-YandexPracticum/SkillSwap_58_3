import { Icon } from '@/shared/ui/icons'
import type { IconName } from '@/shared/ui/icons/types'
import type { CategoriesListProps } from './interface'
import styles from './CategoriesList.module.css'
import clsx from 'clsx'

const categoryIcons: Record<string, IconName> = {
  business: 'category-business',
  languages: 'category-languages',
  home: 'category-home',
  creativity: 'category-art',
  education: 'category-education',
  health: 'category-health',
}

export const CategoriesList = ({ categories, onSelectSubcategory }: CategoriesListProps) => {
  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <section key={category.id} className={styles.category}>
          <div className={styles.header}>
            <span className={clsx(styles.iconWrapper, styles[category.id])}>
              {categoryIcons[category.id] && <Icon name={categoryIcons[category.id]} size={24} />}
            </span>

            <h2 className={styles.title}>{category.name}</h2>
          </div>

          <ul className={styles.subcategories}>
            {category.subcategories.map((subcategory) => (
              <li key={subcategory.id}>
                <button
                  type="button"
                  className={styles.subcategory}
                  onClick={() => onSelectSubcategory?.(subcategory.id)}
                >
                  {subcategory.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
