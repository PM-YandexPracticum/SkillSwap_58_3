export interface AuthFormValues {
  email: string
  password: string
}

export interface AuthFormProps {
  variant: 'login' | 'registration'
  onSubmit: (formFields: Partial<AuthFormValues>) => void | Promise<void>
  errors?: Partial<Record<keyof AuthFormValues, string>>
  savedValues: Partial<AuthFormValues>
}
