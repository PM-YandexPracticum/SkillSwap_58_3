import { SkillsMenu } from '@/widgets/SkillsMenu'
import styles from './SkillsPage.module.css'

// страница со всеми навыками: выбор подкатегории открывает главную с фильтром
export default function SkillsPage() {
  return (
    <section className={styles.page} aria-label="Все навыки">
      <SkillsMenu />
    </section>
  )
}
