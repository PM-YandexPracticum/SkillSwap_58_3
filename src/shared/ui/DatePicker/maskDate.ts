const DAY_END = 2
const MONTH_END = 4
const MAX_DIGITS = 8

/** Оставляет только цифры и разбивает их по формату дд.мм.гггг */
export const maskDate = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, MAX_DIGITS)
  const day = digits.slice(0, DAY_END)
  const month = digits.slice(DAY_END, MONTH_END)
  const year = digits.slice(MONTH_END)

  return [day, month, year].filter(Boolean).join('.')
}
