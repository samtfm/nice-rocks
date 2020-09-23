import { createAction, createReducer } from '@reduxjs/toolkit'

interface NotificationsState {
  [rockId: string]: Rock
}

interface Rock {
  id: string
  toUserId: string
  title: string
  fromDisplayName: string
}

export const queueNewRock = createAction<Rock>('notifications/queueNewRock')
export const lookedAtRock = createAction<Rock>('notifications/lookedAtRock')
export const clearQueue = createAction('notifications/clearQueue')

const initialState: NotificationsState = {}

const notificationsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(queueNewRock, (state, action) => {
      const rock = action.payload
      return {...state, [rock.id]: rock}
    })
    .addCase(lookedAtRock, (state, action) => {
      const rock = action.payload
      const newState = Object.assign({}, state)
      delete newState[rock.id];
      return {...state, [rock.id]: rock}
    })
    .addCase(clearQueue, () => {
      return initialState
    })
})


export default notificationsReducer;