import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Logo } from '@/shared/ui/Logo'
import styles from './Footer.module.css'

const FOOTER_LINKS = {
  about: '/about',
  skills: '/skills',
  contacts: '#',
  blog: '#',
  privacy: '#',
  terms: '#',
} as const

export const Footer = () => {
  return (
    <footer className={clsx(styles.footer)}>
      <div className={clsx(styles.container)}>
        <div className={clsx(styles.brand)}>
          <Logo />
          <span className={styles.copyright}>SkillSwap — 2025</span>
        </div>

        <nav className={clsx(styles.nav)} aria-label="Навигация в подвале">
          <ul className={clsx(styles.column)}>
            <li>
              <Link to={FOOTER_LINKS.about} className={styles.link}>
                О проекте
              </Link>
            </li>
            <li>
              <Link to={FOOTER_LINKS.skills} className={styles.link}>
                Все навыки
              </Link>
            </li>
          </ul>

          <ul className={clsx(styles.column)}>
            <li>
              <Link to={FOOTER_LINKS.contacts} className={styles.link}>
                Контакты
              </Link>
            </li>
            <li>
              <Link to={FOOTER_LINKS.blog} className={styles.link}>
                Блог
              </Link>
            </li>
          </ul>

          <ul className={clsx(styles.column)}>
            <li>
              <Link to={FOOTER_LINKS.privacy} className={styles.link}>
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link to={FOOTER_LINKS.terms} className={styles.link}>
                Пользовательское соглашение
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
