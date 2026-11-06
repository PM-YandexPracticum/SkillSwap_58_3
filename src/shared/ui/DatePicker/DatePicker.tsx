import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react'
import ReactDatePicker, { type ReactDatePickerCustomHeaderProps } from 'react-datepicker'
import { ru } from 'date-fns/locale'
import type { Day, Month } from 'date-fns'
import clsx from 'clsx'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './DatePicker.module.css'
import type { DatePickerProps } from './interface'
import { Button } from '../Button'
import { Icon } from '../icons'

const DATE_FORMAT = 'dd.MM.yyyy'
const MIN_YEAR = 1900
const WEEKDAYS: Day[] = [0, 1, 2, 3, 4, 5, 6]
const MONTHS: Month[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const getMonthName = (month: Month) =>
  capitalize(ru.localize.month(month, { width: 'wide', context: 'standalone' }))

// библиотека передаёт полное название дня, а в календаре нужно короткое: Пн, Вт, Ср
const getWeekdayLabel = (name: string) => {
  const weekday = WEEKDAYS.find(
    (day) => ru.localize.day(day, { width: 'wide' }) === name.toLowerCase(),
  )

  return capitalize(
    weekday === undefined ? name.slice(0, 2) : ru.localize.day(weekday, { width: 'short' }),
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError: boolean
}

// поле, которое библиотека подставляет вместо стандартного input
const Field = forwardRef<HTMLInputElement, FieldProps>(({ hasError, className, ...props }, ref) => (
  <div className={styles.field}>
    <input
      {...props}
      ref={ref}
      className={clsx(styles.input, className, { [styles.error]: hasError })}
      aria-invalid={hasError}
    />
    <Icon className={styles.icon} name="calendar" />
  </div>
))
Field.displayName = 'DatePickerField'

const CalendarHeader = ({ date, changeMonth, changeYear }: ReactDatePickerCustomHeaderProps) => {
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: currentYear - MIN_YEAR + 1 },
    (_, index) => currentYear - index,
  )

  return (
    <div className={styles.header}>
      <div className={styles.selectWrapper}>
        <span>{getMonthName(MONTHS[date.getMonth()])}</span>
        <Icon name="chevron-down" size={16} />
        <select
          className={styles.select}
          aria-label="Месяц"
          value={date.getMonth()}
          onChange={({ target }) => changeMonth(Number(target.value))}
        >
          {MONTHS.map((month) => (
            <option key={month} value={month}>
              {getMonthName(month)}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.selectWrapper}>
        <span>{date.getFullYear()}</span>
        <Icon name="chevron-down" size={16} />
        <select
          className={styles.select}
          aria-label="Год"
          value={date.getFullYear()}
          onChange={({ target }) => changeYear(Number(target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export const DatePicker = ({ label, placeholder, value, onChange, error }: DatePickerProps) => {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<Date | null>(value)

  const openCalendar = () => {
    if (isOpen) return
    setDraft(value)
    setIsOpen(true)
  }

  const cancel = () => {
    setDraft(value)
    setIsOpen(false)
  }

  const confirm = () => {
    onChange(draft)
    setIsOpen(false)
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <ReactDatePicker
        id={id}
        open={isOpen}
        selected={isOpen ? draft : value}
        onChange={setDraft}
        onInputClick={openCalendar}
        onFocus={openCalendar}
        onClickOutside={cancel}
        onKeyDown={(event) => event.key === 'Escape' && cancel()}
        shouldCloseOnSelect={false}
        customInput={<Field hasError={Boolean(error)} />}
        wrapperClassName={styles.pickerWrapper}
        calendarClassName={styles.calendar}
        popperClassName={styles.popper}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        renderCustomHeader={CalendarHeader}
        formatWeekDay={getWeekdayLabel}
        calendarStartDay={1}
        fixedHeight
        dateFormat={DATE_FORMAT}
        locale={ru}
        placeholderText={placeholder}
        minDate={new Date(MIN_YEAR, 0, 1)}
        maxDate={new Date()}
        autoComplete="off"
      >
        <div className={styles.actions}>
          <Button variant="outline" onClick={cancel}>
            Отменить
          </Button>
          <Button onClick={confirm}>Выбрать</Button>
        </div>
      </ReactDatePicker>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}
