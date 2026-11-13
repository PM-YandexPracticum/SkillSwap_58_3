import * as yup from 'yup'

export const passwordSchema = yup
  .string()
  .required('Пароль обязателен')
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .matches(/[A-ZА-ЯЁ]/, 'Пароль должен содержать заглавную букву')
  .matches(/[a-zа-яё]/, 'Пароль должен содержать строчную букву')
  .matches(/[0-9]/, 'Пароль должен содержать цифру')
  .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Пароль должен содержать спецсимвол')

export const validatePassword = (password: string): boolean => {
  return passwordSchema.isValidSync(password)
}

export const getPasswordError = (password: string): string | null => {
  try {
    passwordSchema.validateSync(password)
    return null
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return err.message
    }
    return 'Ошибка валидации'
  }
}
