import clsx from 'clsx'
import { Icon } from '../icons'
import styles from './Logo.module.css'
import { LogoProps } from './interface'

// лого SkillSwap нужен для нескольких раз(нужен для хедера, футера и на экранах входа, и регистрации)

export const Logo = ({ className }: LogoProps) => (
  <div className={clsx(styles.logo, className)}>
    <Icon name="logo" size={40} />
    <span className={styles.text}>SkillSwap</span>
  </div>
)
