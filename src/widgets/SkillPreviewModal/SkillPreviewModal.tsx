import { useId } from 'react'
import { Button } from '@/shared/ui/Button'
import { Carousel } from '@/shared/ui/Carousel'
import { Icon } from '@/shared/ui/icons'
import { Modal } from '@/shared/ui/Modal'
import type { SkillPreviewModalProps } from './interface'
import styles from './SkillPreviewModal.module.css'

const MODAL_WIDTH = 1024

export const SkillPreviewModal = ({
  isOpen,
  skill,
  onEdit,
  onConfirm,
  onClose,
  error,
}: SkillPreviewModalProps) => {
  const headingId = useId()
  const { title, categoryName, subcategoryName, description, images } = skill

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={MODAL_WIDTH}
      className={styles.modal}
      ariaLabelledBy={headingId}
    >
      <header className={styles.header}>
        <h2 id={headingId} className={styles.heading}>
          Ваше предложение
        </h2>
        <p className={styles.hint}>Пожалуйста, проверьте и подтвердите правильность данных</p>
      </header>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.text}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.category}>
              {categoryName} / {subcategoryName}
            </p>
            <p className={styles.description}>{description}</p>
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <div className={styles.actions}>
            <Button
              variant="outline"
              className={styles.action}
              iconRight={<Icon name="edit" />}
              onClick={onEdit}
            >
              Редактировать
            </Button>
            <Button className={styles.action} onClick={onConfirm}>
              Готово
            </Button>
          </div>
        </div>
        <Carousel images={images} className={styles.gallery} />
      </div>
    </Modal>
  )
}
