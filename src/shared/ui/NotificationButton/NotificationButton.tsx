import { NotificationButtonProps } from './interface'
import clsx from 'clsx'
import { Icon } from '../icons'
import styles from './NotificationButton.module.css'

export const NotificationButton = ({ hasNew = false, onClick }: NotificationButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(styles.notificationButton, { [styles.new]: hasNew })}
      onClick={onClick}
      aria-label={hasNew ? 'Уведомления: есть новые' : 'Уведомления'}
    >
      <Icon name="bell" className={styles.bellIcon} />
    </button>
  )
}
