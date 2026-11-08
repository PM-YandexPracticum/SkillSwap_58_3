import { Input } from './Input'

export default {
  title: 'Shared/Input',
  component: Input,
  argTypes: {
    type: { control: 'select', options: ['text', 'password', 'search'] },
    error: { control: 'text' },
    hint: { control: 'text' },
  },
}

// Обычное поле
export const Default = {
  args: {
    label: 'Имя',
    placeholder: 'Введите имя',
    value: '',
    onChange: () => {},
    error: '',
    hint: '',
    iconLeft: '',
    iconRight: '',
  },
}

// С подсказкой
export const WithHint = {
  args: {
    ...Default.args,
    label: 'Email',
    placeholder: 'name@example.com',
    hint: 'Мы не передаём email третьим лицам',
  },
}

// С ошибкой
export const WithError = {
  args: {
    ...Default.args,
    label: 'Пароль',
    placeholder: 'Минимум 8 символов',
    error: 'Пароль слишком короткий',
    type: 'password',
  },
}

//Иконка слева
export const WithLeftIcon = {
  args: {
    ...Default.args,
    label: 'Левая иконка тут',
    placeholder: 'Что нового?',
    iconLeft: 'view-password',
  },
}

// Иконка справа (кастомная) — тип не password, чтобы не подменялась на eyeIcon
export const WithRightIcon = {
  args: {
    ...Default.args,
    label: 'Ссылка',
    placeholder: 'Вставьте URL',
    iconRight: 'view-password',
    type: 'text', // важно: не 'password', иначе компонент сам заменит иконку
  },
}
