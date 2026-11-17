import * as yup from 'yup'

export const emailSchema = yup.string().trim().required('Введите email').email('Некорректный email')

export const validateEmail = (email: string): boolean => {
  return emailSchema.isValidSync(email)
}

export const getEmailError = (email: string): string | null => {
  try {
    emailSchema.validateSync(email)
    return null
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return err.message
    }
    return 'Ошибка валидации'
  }
}
