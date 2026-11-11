import clsx from 'clsx'
import { Icon } from '../icons'
import type { InfoProps } from './interface'
import styles from './Info.module.css'

export function Info({ image, variant, title, description, alt, className }: InfoProps) {
  return (
    <div className={clsx(styles.info, styles[variant], className)}>
      <Icon
        name={image}
        size={variant === 'registration' ? 300 : 460}
        height={variant === 'registration' ? 300 : 304}
        className={styles.image}
        role={alt ? 'img' : undefined}
        aria-hidden={!alt}
        aria-label={alt || undefined}
      />
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}
