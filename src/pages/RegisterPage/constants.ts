import type { InfoProps } from '@/shared/ui/Info'

export const REGISTER_ERRORS = {
  emailRequired: 'Введите email',
  emailTaken: 'Пользователь с такой почтой уже зарегистрирован',
  nameRequired: 'Введите имя',
  birthdayRequired: 'Выберите дату рождения',
  titleRequired: 'Введите название навыка',
  categoryRequired: 'Выберите категорию',
  subcategoryRequired: 'Выберите подкатегорию',
  descriptionRequired: 'Добавьте описание',
  dictionariesFailed: 'Не удалось загрузить списки городов и категорий',
  registerFailed: 'Не удалось зарегистрироваться. Попробуйте ещё раз',
} as const

export type RegisterStep = 1 | 2 | 3

// текст и иллюстрация справа меняются по шагам
export const STEP_INFO: Record<RegisterStep, Omit<InfoProps, 'variant'>> = {
  1: {
    image: 'light-bulb',
    title: 'Добро пожаловать в SkillSwap!',
    description: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
    alt: 'Лампочка как символ обмена знаниями',
  },
  2: {
    image: 'user-info',
    title: 'Расскажите немного о себе',
    description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
    alt: 'Пользователь рассказывает о себе',
  },
  3: {
    image: 'school-board',
    title: 'Укажите, чем вы готовы поделиться',
    description: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
    alt: 'Доска для объяснения навыка',
  },
}
