import clsx from 'clsx'
import { Icon } from '../icons'
import styles from './Logo.module.css'
import { LogoProps } from './interface'
import { Link } from 'react-router-dom'

// лого SkillSwap нужен для нескольких раз(нужен для хедера, футера и на экранах входа, и регистрации)

export const Logo = ({ className }: LogoProps) => (
  <Link
    to="/"
    className={clsx(styles.logo, className)}
    aria-label="SkillSwap перейти на главную страницу"
  >
    <Icon name="logo" size={40} />
    <span className={styles.text}>SkillSwap</span>
  </Link>
)
