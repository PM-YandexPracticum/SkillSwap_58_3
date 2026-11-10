import { NotificationButtonProps } from './interface'
import clsx from 'clsx'
import { Icon } from '../icons'
import styles from './NotificationButton.module.css'

export const NotificationButton = ({
  hasNew = false,
  onClick,
  className,
  ...props
}: NotificationButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(styles.notificationButton, { [styles.new]: hasNew }, className)}
      onClick={onClick}
      aria-label={hasNew ? 'Уведомления: есть новые' : 'Уведомления'}
      {...props}
    >
      <Icon name="bell" />
    </button>
  )
}
