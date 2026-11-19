import { configureStore, createAction } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchSkillById } from '@/api/skills'
import { fetchUserById } from '@/api/users'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { AuthUser, Skill, StoredNotification, SwapRequest, User } from '@/shared/types'
import exchangeReducer, {
  clearViewed,
  exchangeProposed,
  markAllRead,
  proposeExchange,
  selectHasNewNotifications,
  selectIsSkillRequested,
  selectNewNotifications,
  selectProposedUserIds,
  selectViewedNotifications,
  type ExchangeState,
} from './exchangeSlice'

vi.mock('@/api/skills', () => ({ fetchSkillById: vi.fn() }))
vi.mock('@/api/users', () => ({ fetchUserById: vi.fn() }))

const currentUser: AuthUser = {
  id: 'sender',
  name: 'Анна',
  email: 'anna@example.com',
  token: 'sender-token',
}
const anotherUser: AuthUser = { ...currentUser, id: 'another', name: 'Игорь' }
const author: User = {
  id: 'author',
  name: 'Мария',
  email: 'maria@example.com',
  password: 'password',
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  town: 'moscow',
  birthday: '1995-01-01',
  likedCount: 0,
  description: '',
  gender: 'female',
  learn: [],
  favourites: [],
}
const skill: Skill = {
  id: 'skill-1',
  title: 'Фотография',
  description: 'Работа со светом',
  type: 'teach',
  category: 'creativity',
  subcategory: 'photography',
  tags: [],
  images: [],
  authorId: author.id,
  createdAt: '2026-01-01T00:00:00.000Z',
}
const setUser = createAction<AuthUser | null>('test/setUser')
const authReducer = (state: { user: AuthUser | null } = { user: null }, action: unknown) =>
  setUser.match(action) ? { user: action.payload } : state

function createStore(user: AuthUser | null = currentUser, exchange?: ExchangeState) {
  return configureStore({
    reducer: { auth: authReducer, exchange: exchangeReducer },
    preloadedState: {
      auth: { user },
      exchange: exchange ?? exchangeReducer(undefined, { type: 'test/init' }),
    },
  })
}

function makeRequest(overrides: Partial<SwapRequest> = {}): SwapRequest {
  return {
    id: 'request-1',
    skillId: skill.id,
    fromUserId: currentUser.id,
    toUserId: author.id,
    status: 'pending',
    createdAt: '2026-11-16T10:00:00.000Z',
    updatedAt: '2026-11-16T10:00:00.000Z',
    ...overrides,
  }
}

function makeNotification(overrides: Partial<StoredNotification> = {}): StoredNotification {
  return {
    id: 'notification-1',
    userId: author.id,
    skillId: skill.id,
    text: 'Анна предлагает вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    dateLabel: '16 ноября',
    isNew: true,
    ...overrides,
  }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

let savedValues: Map<string, string>

beforeEach(() => {
  vi.resetAllMocks()
  savedValues = new Map()
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => savedValues.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => savedValues.set(key, value)),
  })
  vi.mocked(fetchSkillById).mockResolvedValue(skill)
  vi.mocked(fetchUserById).mockResolvedValue(author)
})

afterEach(() => vi.unstubAllGlobals())

describe('exchangeSlice: заявки', () => {
  it('восстанавливает заявки и уведомления при создании store', () => {
    const request = makeRequest()
    const notification = makeNotification()
    savedValues.set(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify([request]))
    savedValues.set(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([notification]))

    expect(createStore().getState().exchange).toEqual({
      requests: [request],
      notifications: [notification],
    })
  })

  it('добавляет заявку и уведомление вместе, не дублирует ту же пару отправителя и навыка', () => {
    const initial: ExchangeState = { requests: [], notifications: [] }
    const payload = { request: makeRequest(), notifications: [makeNotification()] }
    const next = exchangeReducer(initial, exchangeProposed(payload))

    expect(next).toEqual({ requests: [payload.request], notifications: payload.notifications })
    expect(initial).toEqual({ requests: [], notifications: [] })
    expect(
      exchangeReducer(
        next,
        exchangeProposed({
          request: makeRequest({ id: 'duplicate' }),
          notifications: [makeNotification({ id: 'duplicate-notification' })],
        }),
      ),
    ).toEqual(next)
  })

  it('создаёт ожидающую заявку и новое уведомление автору навыка', async () => {
    const store = createStore()

    await store.dispatch(proposeExchange(skill.id))

    const { requests, notifications } = store.getState().exchange
    expect(requests).toHaveLength(1)
    expect(notifications).toHaveLength(2)
    expect(requests[0]).toEqual({
      id: expect.any(String),
      skillId: skill.id,
      fromUserId: currentUser.id,
      toUserId: author.id,
      status: 'pending',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
    expect(requests[0].id).not.toBe('')
    expect(new Date(requests[0].createdAt).toISOString()).toBe(requests[0].createdAt)
    expect(requests[0].updatedAt).toBe(requests[0].createdAt)
    expect(notifications[0]).toMatchObject({
      userId: author.id,
      skillId: skill.id,
      text: `${currentUser.name} предлагает вам обмен`,
      description: 'Примите обмен, чтобы обсудить детали',
      dateLabel: expect.stringMatching(/\S/),
      isNew: true,
    })
    expect(notifications[0].id).toEqual(expect.any(String))
    expect(fetchSkillById).toHaveBeenCalledWith(skill.id)
    expect(fetchUserById).toHaveBeenCalledWith(author.id)

    expect(notifications[1]).toMatchObject({
      userId: currentUser.id,
      skillId: skill.id,
      text: `Вы предложили обмен пользователю ${author.name}`,
      description: 'Ожидайте ответа на предложение обмена',
      dateLabel: expect.stringMatching(/\S/),
      isNew: true,
    })
    expect(notifications[1].id).toEqual(expect.any(String))
  })

  it('повторный вызов не добавляет заявку и уведомление и не загружает навык заново', async () => {
    const store = createStore()
    await store.dispatch(proposeExchange(skill.id))
    const previous = store.getState().exchange

    await store.dispatch(proposeExchange(skill.id))

    expect(store.getState().exchange).toEqual(previous)
    expect(fetchSkillById).toHaveBeenCalledTimes(1)
  })

  it('сохраняет только одну заявку при двух одновременных вызовах', async () => {
    const pendingSkill = deferred<Skill | undefined>()
    vi.mocked(fetchSkillById).mockReturnValue(pendingSkill.promise)
    const store = createStore()
    const first = store.dispatch(proposeExchange(skill.id))
    const second = store.dispatch(proposeExchange(skill.id))

    pendingSkill.resolve(skill)
    await Promise.all([first, second])

    expect(store.getState().exchange.requests).toHaveLength(1)
    expect(store.getState().exchange.notifications).toHaveLength(2)
  })

  it('разрешает другому пользователю предложить обмен по тому же навыку', async () => {
    const store = createStore()
    await store.dispatch(proposeExchange(skill.id))
    store.dispatch(setUser(anotherUser))

    await store.dispatch(proposeExchange(skill.id))

    expect(store.getState().exchange.requests.map((request) => request.fromUserId)).toEqual([
      currentUser.id,
      anotherUser.id,
    ])
    expect(store.getState().exchange.notifications).toHaveLength(4)
  })

  it('без авторизации не загружает данные и ничего не добавляет', async () => {
    const store = createStore(null)

    await store.dispatch(proposeExchange(skill.id))

    expect(store.getState().exchange).toEqual({ requests: [], notifications: [] })
    expect(fetchSkillById).not.toHaveBeenCalled()
    expect(fetchUserById).not.toHaveBeenCalled()
  })

  it.each([null, anotherUser])(
    'не создаёт заявку, если во время загрузки текущий пользователь изменился на %j',
    async (nextUser) => {
      const pendingSkill = deferred<Skill | undefined>()
      vi.mocked(fetchSkillById).mockReturnValueOnce(pendingSkill.promise)
      const store = createStore()
      const pendingExchange = store.dispatch(proposeExchange(skill.id))
      store.dispatch(setUser(nextUser))

      pendingSkill.resolve(skill)
      await pendingExchange

      expect(store.getState().exchange).toEqual({ requests: [], notifications: [] })
    },
  )

  it('не создаёт заявку для отсутствующего навыка', async () => {
    vi.mocked(fetchSkillById).mockResolvedValueOnce(undefined)
    const store = createStore()

    await store.dispatch(proposeExchange('missing-skill'))

    expect(store.getState().exchange).toEqual({ requests: [], notifications: [] })
    expect(fetchUserById).not.toHaveBeenCalled()
  })

  it('не создаёт заявку после отмены, даже если загрузка автора завершается позже', async () => {
    const pendingAuthor = deferred<User | undefined>()
    vi.mocked(fetchUserById).mockReturnValueOnce(pendingAuthor.promise)
    const store = createStore()
    const pendingExchange = store.dispatch(proposeExchange(skill.id))
    await Promise.resolve()
    expect(fetchUserById).toHaveBeenCalledWith(author.id)

    pendingExchange.abort()
    const result = await pendingExchange
    expect(proposeExchange.rejected.match(result) && result.meta.aborted).toBe(true)

    pendingAuthor.resolve(author)
    await pendingAuthor.promise
    await Promise.resolve()

    expect(store.getState().exchange).toEqual({ requests: [], notifications: [] })
  })

  it('не создаёт заявку для отсутствующего автора', async () => {
    vi.mocked(fetchUserById).mockResolvedValueOnce(undefined)
    const store = createStore()

    await store.dispatch(proposeExchange(skill.id))

    expect(store.getState().exchange).toEqual({ requests: [], notifications: [] })
  })

  it('не предлагает обмен самому себе', async () => {
    const store = createStore({ ...currentUser, id: author.id })

    await store.dispatch(proposeExchange(skill.id))

    expect(store.getState().exchange).toEqual({ requests: [], notifications: [] })
  })

  it('при ошибке загрузки не оставляет частичную заявку или уведомление', async () => {
    vi.mocked(fetchUserById).mockRejectedValueOnce(new Error('Network unavailable'))
    const store = createStore()

    const result = await store.dispatch(proposeExchange(skill.id))

    expect(proposeExchange.rejected.match(result)).toBe(true)
    expect(store.getState().exchange).toEqual({ requests: [], notifications: [] })
  })
})

describe('exchangeSlice: уведомления и селекторы', () => {
  const notifications = [
    makeNotification({ id: 'sender-new', userId: currentUser.id }),
    makeNotification({ id: 'sender-viewed', userId: currentUser.id, isNew: false }),
    makeNotification({ id: 'another-new', userId: anotherUser.id }),
    makeNotification({ id: 'another-viewed', userId: anotherUser.id, isNew: false }),
  ]

  it('помечает прочитанными только уведомления указанного пользователя', () => {
    const initial: ExchangeState = { requests: [makeRequest()], notifications }

    const next = exchangeReducer(initial, markAllRead(currentUser.id))

    expect(next.notifications.map(({ id, isNew }) => ({ id, isNew }))).toEqual([
      { id: 'sender-new', isNew: false },
      { id: 'sender-viewed', isNew: false },
      { id: 'another-new', isNew: true },
      { id: 'another-viewed', isNew: false },
    ])
    expect(initial.notifications[0].isNew).toBe(true)
    expect(next.requests).toEqual(initial.requests)
  })

  it('удаляет только прочитанные уведомления указанного пользователя', () => {
    const initial: ExchangeState = { requests: [makeRequest()], notifications }

    const next = exchangeReducer(initial, clearViewed(currentUser.id))

    expect(next.notifications.map(({ id }) => id)).toEqual([
      'sender-new',
      'another-new',
      'another-viewed',
    ])
    expect(initial.notifications).toHaveLength(4)
    expect(next.requests).toEqual(initial.requests)
  })

  it('отбирает заявки отправителя и уведомления получателя после переключения пользователя', () => {
    const store = createStore(currentUser, {
      requests: [
        makeRequest(),
        makeRequest({ id: 'request-2', skillId: 'skill-2' }),
        makeRequest({ id: 'request-3', fromUserId: anotherUser.id, toUserId: 'another-author' }),
      ],
      notifications,
    })
    const isRequested = selectIsSkillRequested(skill.id)

    expect(selectProposedUserIds(store.getState())).toEqual([author.id])
    expect(isRequested(store.getState())).toBe(true)
    expect(selectNewNotifications(store.getState()).map(({ id }) => id)).toEqual(['sender-new'])
    expect(selectViewedNotifications(store.getState()).map(({ id }) => id)).toEqual([
      'sender-viewed',
    ])
    expect(selectHasNewNotifications(store.getState())).toBe(true)

    store.dispatch(setUser(anotherUser))

    expect(selectProposedUserIds(store.getState())).toEqual(['another-author'])
    expect(isRequested(store.getState())).toBe(true)
    expect(selectIsSkillRequested('skill-2')(store.getState())).toBe(false)
    expect(selectNewNotifications(store.getState()).map(({ id }) => id)).toEqual(['another-new'])
    expect(selectViewedNotifications(store.getState()).map(({ id }) => id)).toEqual([
      'another-viewed',
    ])

    store.dispatch(markAllRead(anotherUser.id))
    expect(selectHasNewNotifications(store.getState())).toBe(false)

    store.dispatch(setUser(null))
    expect(selectProposedUserIds(store.getState())).toEqual([])
    expect(isRequested(store.getState())).toBe(false)
    expect(selectNewNotifications(store.getState())).toEqual([])
    expect(selectViewedNotifications(store.getState())).toEqual([])
    expect(selectHasNewNotifications(store.getState())).toBe(false)
  })

  it('сохраняет ссылки списков, если данные и id текущего пользователя не изменились', () => {
    const state = createStore(currentUser, { requests: [makeRequest()], notifications }).getState()
    const newNotifications = selectNewNotifications(state)
    const viewedNotifications = selectViewedNotifications(state)
    const proposedUserIds = selectProposedUserIds(state)
    const nextState = { ...state, auth: { user: { ...currentUser } } }

    expect(selectNewNotifications(nextState)).toBe(newNotifications)
    expect(selectViewedNotifications(nextState)).toBe(viewedNotifications)
    expect(selectProposedUserIds(nextState)).toBe(proposedUserIds)
  })
})
