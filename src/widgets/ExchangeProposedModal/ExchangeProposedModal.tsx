import { Modal } from '@/shared/ui/Modal'
import { Icon } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import styles from './ExchangeProposedModal.module.css'
import type { ExchangeProposedModalProps } from './interface'

export const ExchangeProposedModal = ({ isOpen, onClose }: ExchangeProposedModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Вы предложили обмен">
      <div className={styles.container}>
        <Icon name="bell" />
        <h3 className={styles.exchangeHeadingText}>Вы предложили обмен</h3>
        <p>Теперь дождитесь подтверждения. Вам придёт уведомление</p>
        <Button onClick={onClose} className={styles.readyButton}>
          Готово
        </Button>
      </div>
    </Modal>
  )
}
