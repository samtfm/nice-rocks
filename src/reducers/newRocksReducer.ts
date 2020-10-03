import { createAction, createReducer } from '@reduxjs/toolkit'
import { getNextTime } from './util'

interface Time {
  hours: number,
  minutes: number,
  disabled?: boolean,
}

interface NewRocksState {
  rocks: Rock[]
  nextNotifDateTime: number | null // stringified date
  notifTimes: {[str: string]: Time} // str in format `hours:minutes`
}

interface Rock {
  id: string
  toUserId: string
  title: string
  fromDisplayName: string
}
interface RockId {
  id: string
  toUserId: string
}

export const queueNewRock = createAction<Rock>('newRocks/queueNewRock')
export const lookedAtRock = createAction<RockId>('newRocks/lookedAtRock')
export const setNotificationTime = createAction<Time>('newRocks/setNotificationTime')
export const removeNotificationTime = createAction<Time>('newRocks/removeNotificationTime')

const initialState: NewRocksState = {
  rocks: [],
  nextNotifDateTime: null,
  notifTimes: {
    '9:0': {
      hours: 9,
      minutes: 0,
      disabled: true,
    },
    '17:30': {
      hours: 17,
      minutes: 30,
      disabled: false,
    }
  },
}

const newRocksReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(queueNewRock, (state, action) => {
      const newState = Object.assign({}, state)
      if (!state.nextNotifDateTime || state.nextNotifDateTime < Date.now()) {
        newState.rocks = []
        newState.nextNotifDateTime = getNextTime(state.notifTimes)
      }
      newState.rocks = newState.rocks.concat(action.payload)
      return newState
    })
    .addCase(lookedAtRock, (state, action) => {
      return {...state, rocks: state.rocks.filter(rock => rock.id !== action.payload.id)}
    })
    .addCase(setNotificationTime, (state, action) => {
      const newState = Object.assign({}, state)
      if (state.nextNotifDateTime && state.nextNotifDateTime < Date.now()) {
        newState.nextNotifDateTime = null
        newState.rocks = []
      }
  
      const newTime = action.payload
      newTime.disabled = newTime.disabled || false;
      const newNotifTimes = {...state.notifTimes, [`${newTime.hours}:${newTime.minutes}`]: newTime}
      newState.notifTimes = newNotifTimes
      newState.nextNotifDateTime = getNextTime(newNotifTimes)
      return newState
    })
    .addCase(removeNotificationTime, (state, action) => {
      const newState = Object.assign({}, state)
      if (state.nextNotifDateTime && state.nextNotifDateTime < Date.now()) {
        newState.nextNotifDateTime = null
        newState.rocks = []
      }
      const toRemove = action.payload
      const newNotifTimes = Object.assign({}, state.notifTimes)
      delete newNotifTimes[`${toRemove.hours}:${toRemove.minutes}`]
      
      newState.notifTimes = newNotifTimes
      newState.nextNotifDateTime = getNextTime(newNotifTimes)
      return newState
    })
})


export default newRocksReducer;