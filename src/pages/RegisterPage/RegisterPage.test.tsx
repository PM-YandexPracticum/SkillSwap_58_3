import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchUsers } from '@/api/users'
import authReducer, { selectAuthUser } from '@/features/auth/model/authSlice'
import { LOCAL_STORAGE_KEYS, ROUTES } from '@/shared/lib/constants'
import type { Category, City, User } from '@/shared/types'
import { REGISTER_ERRORS } from './constants'
import RegisterPage from './index'

const TAKEN_EMAIL = 'taken@example.com'
const NEW_EMAIL = 'new@example.com'
const VALID_PASSWORD = 'Abcdef1!'

const cities: City[] = [{ id: 'moscow', name: 'Москва' }]
const categories: Category[] = [
  {
    id: 'creativity',
    name: 'Творчество',
    subcategories: [{ id: 'creativity-drums', name: 'Барабаны' }],
  },
]

vi.mock('@/api/cities', () => ({ fetchCities: () => Promise.resolve(cities) }))
vi.mock('@/api/categories', () => ({ fetchCategories: () => Promise.resolve(categories) }))
vi.mock('@/api/users', () => ({ fetchUsers: vi.fn() }))

const takenUser = { id: 'user-1', email: TAKEN_EMAIL } as User

function renderPage() {
  const store = configureStore({ reducer: { auth: authReducer } })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[ROUTES.REGISTER]}>
        <Routes>
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.HOME} element={<p>Главная страница</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
  return { store, user: userEvent.setup() }
}

type User_ = ReturnType<typeof userEvent.setup>

async function fillStep1(user: User_, email = NEW_EMAIL, password = VALID_PASSWORD) {
  await user.type(screen.getByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Пароль'), password)
  await user.click(screen.getByRole('button', { name: 'Далее' }))
}

async function fillStep2(user: User_) {
  await user.type(await screen.findByLabelText('Имя'), 'Иван')
  const birthday = screen.getByLabelText('Дата рождения')
  await user.click(birthday)
  await user.type(birthday, '27041995')
  await user.click(screen.getByRole('button', { name: 'Выбрать' }))
  await user.click(screen.getByRole('button', { name: 'Продолжить' }))
}

async function fillStep3(user: User_) {
  await user.type(await screen.findByLabelText('Название навыка'), 'Игра на барабанах')
  await user.click(screen.getByText('Выберите подкатегорию навыка'))
  await user.click(await screen.findByText('Барабаны'))
  await user.type(screen.getByLabelText('Описание'), 'Научу держать ритм')
  await user.click(screen.getByRole('button', { name: 'Продолжить' }))
}

beforeEach(() => {
  localStorage.clear()
  vi.mocked(fetchUsers).mockResolvedValue([takenUser])
})

describe('RegisterPage: шаг 1', () => {
  it('показывает ошибку под полем почты, если почта пустая', async () => {
    const { user } = renderPage()

    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByText(REGISTER_ERRORS.emailRequired)).toBeInTheDocument()
  })

  it('показывает ошибку, если почта уже занята', async () => {
    const { user } = renderPage()

    await fillStep1(user, TAKEN_EMAIL)

    expect(await screen.findByText(REGISTER_ERRORS.emailTaken)).toBeInTheDocument()
  })

  it('показывает ошибку под полем пароля, если пароль слабый', async () => {
    const { user } = renderPage()

    await fillStep1(user, NEW_EMAIL, 'abc')

    expect(
      await screen.findByText('Пароль должен содержать минимум 8 символов'),
    ).toBeInTheDocument()
  })

  it('при верных данных открывает шаг 2', async () => {
    const { user } = renderPage()

    await fillStep1(user)

    expect(await screen.findByRole('form', { name: 'Второй шаг регистрации' })).toBeInTheDocument()
  })
})

describe('RegisterPage: шаги 2 и 3', () => {
  it('шаг 2 не пускает дальше без имени и даты рождения', async () => {
    const { user } = renderPage()
    await fillStep1(user)

    await user.click(await screen.findByRole('button', { name: 'Продолжить' }))

    expect(screen.getByText(REGISTER_ERRORS.nameRequired)).toBeInTheDocument()
    expect(screen.getByText(REGISTER_ERRORS.birthdayRequired)).toBeInTheDocument()
  })

  it('кнопка Назад возвращает на шаг 1 и сохраняет введённые значения', async () => {
    const { user } = renderPage()
    await fillStep1(user)

    await user.click(await screen.findByRole('button', { name: 'Назад' }))

    expect(screen.getByLabelText('Email')).toHaveValue(NEW_EMAIL)
  })

  it('шаг 3 не пускает дальше с пустыми обязательными полями', async () => {
    const { user } = renderPage()
    await fillStep1(user)
    await fillStep2(user)

    await user.click(await screen.findByRole('button', { name: 'Продолжить' }))

    expect(screen.getByText(REGISTER_ERRORS.titleRequired)).toBeInTheDocument()
    expect(screen.getByText(REGISTER_ERRORS.subcategoryRequired)).toBeInTheDocument()
    expect(screen.getByText(REGISTER_ERRORS.descriptionRequired)).toBeInTheDocument()
  })

  it('с заполненным шагом 3 открывает модалку с введённым навыком', async () => {
    const { user } = renderPage()
    await fillStep1(user)
    await fillStep2(user)
    await fillStep3(user)

    expect(await screen.findByText('Игра на барабанах', { selector: 'h2, h3' })).toBeInTheDocument()
  })
})

describe('RegisterPage: регистрация', () => {
  it('Готово создаёт пользователя, входит в аккаунт и переводит на главную', async () => {
    const { user, store } = renderPage()
    await fillStep1(user)
    await fillStep2(user)
    await fillStep3(user)

    await user.click(await screen.findByRole('button', { name: 'Готово' }))

    expect(await screen.findByText('Главная страница')).toBeInTheDocument()
    expect(selectAuthUser(store.getState())?.email).toBe(NEW_EMAIL)
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS)).toContain(NEW_EMAIL)
  })

  it('показывает ошибку регистрации в модалке и не закрывает её', async () => {
    const { user } = renderPage()
    await fillStep1(user)
    await fillStep2(user)
    await fillStep3(user)
    // пока пользователь заполнял форму, почту успели занять
    vi.mocked(fetchUsers).mockResolvedValue([{ ...takenUser, email: NEW_EMAIL }])

    await user.click(await screen.findByRole('button', { name: 'Готово' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(REGISTER_ERRORS.emailTaken)
    expect(screen.queryByText('Главная страница')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Готово' })).toBeInTheDocument()
  })
})
