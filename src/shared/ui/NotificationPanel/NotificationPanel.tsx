import { NotificationPanelProps } from './interface'
import clsx from 'clsx'
import styles from './NotificationPanel.module.css'
import { Icon } from '../icons'
import { Button } from '../Button'

export const NotificationPanel = ({
  newItems,
  viewedItems,
  onGo,
  onReadAll,
  onClear,
}: NotificationPanelProps) => {
  return (
    <section className={clsx(styles.notificationPanel)}>
      <div className={clsx(styles.mainContainer)}>
        <div className={clsx(styles.headingContainer)}>
          <h3 className={clsx(styles.notificationHeading)}>Новые уведомления</h3>
          {newItems.length > 0 && (
            <Button variant="link" onClick={onReadAll}>
              Прочитать все
            </Button>
          )}
        </div>
        {newItems.length > 0 ? (
          <ul className={clsx(styles.notificationList)}>
            {newItems.map((item) => {
              return (
                <li key={item.id} className={clsx(styles.notificationCard)}>
                  <div className={clsx(styles.cardContent)}>
                    <div className={clsx(styles.textAndIcon)}>
                      <Icon name="bulb" />
                      <div className={clsx(styles.textArea)}>
                        <span className={clsx(styles.itemText)}>{item.text}</span>
                        <span className={clsx(styles.itemDescription)}>{item.description}</span>
                      </div>
                    </div>
                    <span className={clsx(styles.itemDateLabel)}>{item.dateLabel}</span>
                  </div>
                  <Button
                    variant="primary"
                    onClick={onGo}
                    aria-label={`перейти к Уведомлению: ${item.text}`}
                  >
                    Перейти
                  </Button>
                </li>
              )
            })}
          </ul>
        ) : (
          <span className={clsx(styles.noItems)}>Нет уведомлений</span>
        )}
      </div>

      <div className={clsx(styles.mainContainer)}>
        <div className={clsx(styles.headingContainer)}>
          <h3 className={clsx(styles.notificationHeading)}>Просмотренные</h3>
          {viewedItems.length > 0 && (
            <Button variant="link" onClick={onClear}>
              Очистить
            </Button>
          )}
        </div>
        {viewedItems.length > 0 ? (
          <ul className={clsx(styles.notificationList)}>
            {viewedItems.map((item) => {
              return (
                <li key={item.id} className={clsx(styles.notificationCard)}>
                  <div className={clsx(styles.cardContent)}>
                    <div className={clsx(styles.textAndIcon)}>
                      <Icon name="bulb" />
                      <div className={clsx(styles.textArea)}>
                        <span className={clsx(styles.itemText)}>{item.text}</span>
                        <span className={clsx(styles.itemDescription)}>{item.description}</span>
                      </div>
                    </div>
                    <span className={clsx(styles.itemDateLabel)}>{item.dateLabel}</span>
                  </div>
                  <Button
                    variant="primary"
                    onClick={onGo}
                    aria-label={`перейти к Уведомлению: ${item.text}`}
                  >
                    Перейти
                  </Button>
                </li>
              )
            })}
          </ul>
        ) : (
          <span className={clsx(styles.noItems)}>Нет уведомлений</span>
        )}
      </div>
    </section>
  )
}
