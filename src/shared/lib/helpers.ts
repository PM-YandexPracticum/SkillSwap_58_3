/** Форматирует дату в читаемый вид */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Возвращает полное число лет по дате рождения, 0 — для некорректной или будущей даты */
export function getAgeFromBirthDate(birthDate: string | Date): number {
  let date: Date

  if (birthDate instanceof Date) {
    date = birthDate
  } else {
    if (birthDate.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return 0

    const [year, month, day] = birthDate.split('-').map(Number)
    if (month < 1 || month > 12 || day < 1 || day > 31) return 0

    date = new Date(0)
    date.setFullYear(year, month - 1, day)
    date.setHours(0, 0, 0, 0)

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return 0
    }
  }

  if (Number.isNaN(date.getTime())) return 0

  const today = new Date()
  let age = today.getFullYear() - date.getFullYear()
  const monthDifference = today.getMonth() - date.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) {
    age -= 1
  }

  return Math.max(0, age)
}

/** Обрезает строку до maxLength символов */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/** Генерирует уникальный id */
export function generateId(): string {
  return crypto.randomUUID()
}
