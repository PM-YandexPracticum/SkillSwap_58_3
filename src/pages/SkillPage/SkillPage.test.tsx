import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCategories } from '@/api/categories'
import { fetchCities } from '@/api/cities'
import { fetchSkillById, fetchSkills } from '@/api/skills'
import { fetchUserById, fetchUsers } from '@/api/users'
import { ROUTES } from '@/shared/lib/constants'
import type { Skill, User } from '@/shared/types'
import categories from '../../../public/db/categories.json'
import cities from '../../../public/db/cities.json'
import skillsFixture from '../../../public/db/skills.json'
import usersFixture from '../../../public/db/users.json'
import SkillPage from './index'

vi.mock('@/api/categories', () => ({ fetchCategories: vi.fn() }))
vi.mock('@/api/cities', () => ({ fetchCities: vi.fn() }))
vi.mock('@/api/skills', () => ({ fetchSkillById: vi.fn(), fetchSkills: vi.fn() }))
vi.mock('@/api/users', () => ({ fetchUserById: vi.fn(), fetchUsers: vi.fn() }))

const skills = skillsFixture as Skill[]
const users = usersFixture as unknown as User[]
const currentSkill = skills.find((skill) => skill.id === 'skill-01')!
const nextSkill = skills.find((skill) => skill.id === 'skill-03')!

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

function renderPage(id = currentSkill.id) {
  return render(
    <MemoryRouter initialEntries={['/skill/' + id]}>
      <Link to={'/skill/' + nextSkill.id}>Открыть другой навык</Link>
      <Routes>
        <Route path={ROUTES.SKILL} element={<SkillPage />} />
        <Route path={ROUTES.HOME} element={<p>Главная страница</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(fetchSkillById).mockImplementation(async (id) =>
    skills.find((skill) => skill.id === id),
  )
  vi.mocked(fetchSkills).mockResolvedValue(skills)
  vi.mocked(fetchUserById).mockImplementation(async (id) => users.find((user) => user.id === id))
  vi.mocked(fetchUsers).mockResolvedValue(users)
  vi.mocked(fetchCategories).mockResolvedValue(categories)
  vi.mocked(fetchCities).mockResolvedValue(cities)
})

afterEach(cleanup)

describe('SkillPage', () => {
  it('показывает загрузку, затем данные навыка и автора из маршрута', async () => {
    const request = deferred<Skill | undefined>()
    vi.mocked(fetchSkillById).mockReturnValueOnce(request.promise)
    renderPage()

    expect(screen.getByRole('status', { name: 'идет загрузка' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: currentSkill.title })).not.toBeInTheDocument()

    await act(async () => request.resolve(currentSkill))

    expect(await screen.findByRole('heading', { name: currentSkill.title })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Иван Петров' })).toHaveTextContent('Москва')
    expect(screen.getByText(currentSkill.description)).toBeInTheDocument()
    expect(screen.getByText('Творчество и искусство / Фотография')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Подробнее' })).toHaveLength(4)
    expect(screen.queryByRole('status', { name: 'идет загрузка' })).not.toBeInTheDocument()
  })

  it.each(['навык', 'автор'] as const)(
    'показывает отсутствие данных, если не найден %s',
    async (missing) => {
      if (missing === 'автор') {
        vi.mocked(fetchUserById).mockResolvedValue(undefined)
        vi.mocked(fetchUsers).mockResolvedValue(
          users.filter((user) => user.id !== currentSkill.authorId),
        )
      }
      const user = userEvent.setup()
      renderPage(missing === 'навык' ? 'missing-skill' : currentSkill.id)

      expect(await screen.findByRole('heading', { name: 'Навык не найден' })).toBeInTheDocument()
      await user.click(screen.getByRole('link', { name: 'На главную' }))
      expect(screen.getByText('Главная страница')).toBeInTheDocument()
    },
  )

  it('показывает ошибку загрузки и переход на главную', async () => {
    vi.mocked(fetchSkills).mockRejectedValue(new Error('Network unavailable'))
    const user = userEvent.setup()
    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Не удалось загрузить навык' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Навык не найден' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'На главную' }))
    expect(screen.getByText('Главная страница')).toBeInTheDocument()
  })

  it('обновляет локальные действия и открывает навык из рекомендации', async () => {
    const user = userEvent.setup()
    renderPage()
    const card = await screen.findByRole('article', {
      name: `${currentSkill.title}. Автор: Иван Петров`,
    })

    await user.click(within(card).getByRole('button', { name: /поставить лайк/ }))
    expect(within(card).getByRole('button', { name: 'убрать лайк' })).toBeInTheDocument()
    await user.click(within(card).getByRole('button', { name: 'Предложить обмен' }))
    expect(within(card).getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()

    const recommendation = screen.getByRole('article', { name: 'Мария Соколова' })
    await user.click(within(recommendation).getByRole('button', { name: /поставить лайк/ }))
    expect(within(recommendation).getByRole('button', { name: 'убрать лайк' })).toBeInTheDocument()
    await user.click(within(recommendation).getByRole('button', { name: 'Подробнее' }))

    const nextCard = await screen.findByRole('article', {
      name: `${nextSkill.title}. Автор: Мария Соколова`,
    })
    expect(within(nextCard).getByRole('button', { name: 'убрать лайк' })).toBeInTheDocument()
    expect(within(nextCard).getByRole('button', { name: 'Предложить обмен' })).toBeEnabled()
    expect(
      screen.queryByRole('article', { name: `${currentSkill.title}. Автор: Иван Петров` }),
    ).not.toBeInTheDocument()
  })

  it('не заменяет новый маршрут результатом старого запроса', async () => {
    const oldRequest = deferred<Skill | undefined>()
    vi.mocked(fetchSkillById).mockImplementation(async (id) =>
      id === currentSkill.id ? oldRequest.promise : skills.find((skill) => skill.id === id),
    )
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('link', { name: 'Открыть другой навык' }))
    expect(
      await screen.findByRole('article', { name: `${nextSkill.title}. Автор: Мария Соколова` }),
    ).toBeInTheDocument()

    await act(async () => oldRequest.resolve(currentSkill))

    expect(
      screen.getByRole('article', { name: `${nextSkill.title}. Автор: Мария Соколова` }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('article', { name: `${currentSkill.title}. Автор: Иван Петров` }),
    ).not.toBeInTheDocument()
  })
})
