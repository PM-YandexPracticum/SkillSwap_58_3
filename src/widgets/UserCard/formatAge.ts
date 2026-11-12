const YEARS_FORMS = ['год', 'года', 'лет'] as const

/** Возраст с правильным окончанием: 21 год, 34 года, 25 лет */
export const formatAge = (age: number): string => {
  const lastTwoDigits = age % 100
  const lastDigit = age % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${age} ${YEARS_FORMS[2]}`
  if (lastDigit === 1) return `${age} ${YEARS_FORMS[0]}`
  if (lastDigit >= 2 && lastDigit <= 4) return `${age} ${YEARS_FORMS[1]}`

  return `${age} ${YEARS_FORMS[2]}`
}
