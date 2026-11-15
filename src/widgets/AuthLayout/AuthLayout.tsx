import { Button } from '@/shared/ui/Button'
import { Icon } from '@/shared/ui/icons'
import { Info } from '@/shared/ui/Info'
import { Logo } from '@/shared/ui/Logo'
import { Stepper } from '@/shared/ui/Stepper'
import type { AuthLayoutProps } from './interface'
import styles from './AuthLayout.module.css'

export function AuthLayout({ children, currentStep, onClose, ...infoProps }: AuthLayoutProps) {
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
        <Info {...infoProps} />
      </main>
    </div>
  )
}
