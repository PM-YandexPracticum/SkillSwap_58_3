import { NotificationPanelProps, NotificationSectionProps } from './interface'
import clsx from 'clsx'
import styles from './NotificationPanel.module.css'
import { Icon } from '../icons'
import { Button } from '../Button'

export const NofificationSection = ({
  items,
  heading,
  onButtonClick,
  onGo,
  buttonName,
}: NotificationSectionProps) => {
  return (
    <div className={clsx(styles.mainContainer)}>
      <div className={clsx(styles.headingContainer)}>
        <h3 className={clsx(styles.notificationHeading)}>{heading}</h3>
        {items.length > 0 && (
          <Button variant="link" onClick={onButtonClick}>
            {buttonName}
          </Button>
        )}
      </div>
      {items.length > 0 ? (
        <ul className={clsx(styles.notificationList)}>
          {items.map((item) => {
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
                {onGo && (
                  <Button
                    variant="primary"
                    onClick={() => onGo(item.id)}
                    aria-label={`перейти к Уведомлению: ${item.text}`}
                  >
                    Перейти
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <span className={clsx(styles.noItems)}>Нет уведомлений</span>
      )}
    </div>
  )
}

export const NotificationPanel = ({
  newItems,
  viewedItems,
  onGo,
  onReadAll,
  onClear,
}: NotificationPanelProps) => {
  return (
    <section className={clsx(styles.notificationPanel)}>
      <NofificationSection
        items={newItems}
        heading="Новые уведомления"
        buttonName="Прочитать все"
        onButtonClick={onReadAll}
        onGo={onGo}
      />

      <NofificationSection
        items={viewedItems}
        heading="Просмотренные"
        buttonName="Очистить"
        onButtonClick={onClear}
      />
    </section>
  )
}
