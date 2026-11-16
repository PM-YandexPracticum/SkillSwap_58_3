import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchSkillById } from '@/api/skills'
import { fetchUserById } from '@/api/users'
import type { AuthUser, StoredNotification, SwapRequest } from '@/shared/types'
import { getStoredNotifications, getStoredRequests } from './exchangeUtils'

export interface ExchangeState {
  requests: SwapRequest[]
  notifications: StoredNotification[]
}

interface ExchangeRootState {
  auth: { user: AuthUser | null }
  exchange: ExchangeState
}

const selectRequests = (state: ExchangeRootState) => state.exchange.requests
const selectNotifications = (state: ExchangeRootState) => state.exchange.notifications
const selectCurrentUserId = (state: ExchangeRootState) => state.auth.user?.id

export const selectProposedUserIds = createSelector(
  [selectRequests, selectCurrentUserId],
  (requests, userId) =>
    userId
      ? [
          ...new Set(
            requests.filter((item) => item.fromUserId === userId).map((item) => item.toUserId),
          ),
        ]
      : [],
)

export const selectIsSkillRequested = (skillId: string) =>
  createSelector([selectRequests, selectCurrentUserId], (requests, userId) =>
    userId
      ? requests.some((item) => item.fromUserId === userId && item.skillId === skillId)
      : false,
  )

export const selectNewNotifications = createSelector(
  [selectNotifications, selectCurrentUserId],
  (notifications, userId) =>
    userId ? notifications.filter((item) => item.userId === userId && item.isNew) : [],
)

export const selectViewedNotifications = createSelector(
  [selectNotifications, selectCurrentUserId],
  (notifications, userId) =>
    userId ? notifications.filter((item) => item.userId === userId && !item.isNew) : [],
)

export const selectHasNewNotifications = createSelector(
  [selectNewNotifications],
  (notifications) => notifications.length > 0,
)

export const exchangeSlice = createSlice({
  name: 'exchange',
  initialState: (): ExchangeState => ({
    requests: getStoredRequests(),
    notifications: getStoredNotifications(),
  }),
  reducers: {
    exchangeProposed(
      state,
      { payload }: PayloadAction<{ request: SwapRequest; notification: StoredNotification }>,
    ) {
      if (
        state.requests.some(
          (item) =>
            item.fromUserId === payload.request.fromUserId &&
            item.skillId === payload.request.skillId,
        )
      )
        return
      state.requests.push(payload.request)
      state.notifications.push(payload.notification)
    },
    markAllRead(state, { payload: userId }: PayloadAction<string>) {
      state.notifications.forEach((item) => {
        if (item.userId === userId) item.isNew = false
      })
    },
    clearViewed(state, { payload: userId }: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (item) => item.userId !== userId || item.isNew,
      )
    },
  },
})

export const { exchangeProposed, markAllRead, clearViewed } = exchangeSlice.actions

export const proposeExchange = createAsyncThunk<void, string, { state: ExchangeRootState }>(
  'exchange/proposeExchange',
  async (skillId, { getState, dispatch, signal }) => {
    const user = getState().auth.user
    if (!user || selectIsSkillRequested(skillId)(getState())) return

    const skill = await fetchSkillById(skillId)
    if (!skill || skill.authorId === user.id) return
    const author = await fetchUserById(skill.authorId)
    if (
      signal.aborted ||
      !author ||
      getState().auth.user?.id !== user.id ||
      selectIsSkillRequested(skillId)(getState())
    )
      return

    const now = new Date()
    const createdAt = now.toISOString()
    dispatch(
      exchangeProposed({
        request: {
          id: crypto.randomUUID(),
          skillId: skill.id,
          fromUserId: user.id,
          toUserId: author.id,
          status: 'pending',
          createdAt,
          updatedAt: createdAt,
        },
        notification: {
          id: crypto.randomUUID(),
          userId: author.id,
          skillId: skill.id,
          isNew: true,
          text: `${user.name} предлагает вам обмен`,
          description: 'Примите обмен, чтобы обсудить детали',
          dateLabel: new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(
            now,
          ),
        },
      }),
    )
  },
)

export default exchangeSlice.reducer
