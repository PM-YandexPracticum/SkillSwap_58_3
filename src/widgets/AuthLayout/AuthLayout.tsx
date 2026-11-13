import clsx from 'clsx'
import { Button } from '@/shared/ui/Button'
import { Icon } from '@/shared/ui/icons'
import { Logo } from '@/shared/ui/Logo'
import { Stepper } from '@/shared/ui/Stepper'
import type { AuthLayoutProps } from './interface'
import styles from './AuthLayout.module.css'

export function AuthLayout({
  children,
  title,
  description,
  illustrationSrc,
  currentStep,
  onClose,
}: AuthLayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Logo className={styles.logo} />
        {currentStep !== undefined && (
          <div className={styles.stepper}>
            <Stepper currentStep={currentStep} />
          </div>
        )}
        {onClose && (
          <Button
            className={styles.close}
            variant="outline"
            iconRight={<Icon name="close" size={24} />}
            onClick={onClose}
          >
            Закрыть
          </Button>
        )}
      </header>
      <main className={styles.content}>
        <div className={styles.card}>{children}</div>
        <section className={clsx(styles.card, styles.illustrationCard)}>
          <img
            className={styles.illustration}
            src={illustrationSrc}
            width={300}
            height={300}
            alt=""
          />
          <div className={styles.text}>
            <h2 className={styles.title}>{title}</h2>
            <p>{description}</p>
          </div>
        </section>
      </main>
    </div>
  )
}
