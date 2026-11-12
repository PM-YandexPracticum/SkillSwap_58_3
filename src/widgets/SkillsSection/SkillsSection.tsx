import { UserCard } from '../UserCard/UserCard'
import type { SkillsSectionProps } from './interface'
import styles from './SkillsSection.module.css'

export const SkillsSection = ({ title, items, actions }: SkillsSectionProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <UserCard key={item.id} {...item} variant="catalog" />
        ))}
      </div>
    </section>
  )
}
