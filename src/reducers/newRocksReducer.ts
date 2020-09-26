import { createAction, createReducer } from '@reduxjs/toolkit'

interface Time {
  hours: number,
  minutes: number,
  disabled?: boolean,
}

interface NewRocksState {
  rocks: Rock[]
  nextNotifDateTime: Date | null
  notifTimes: {[str: string]: Time} // str in format `hours:minutes`
}

interface Rock {
  id: string
  toUserId: string
  title: string
  fromDisplayName: string
}

export const queueNewRock = createAction<Rock>('newRocks/queueNewRock')
export const lookedAtRock = createAction<Rock>('newRocks/lookedAtRock')
export const setNotificationTime = createAction<Time>('settings/setNotificationTime')
export const removeNotificationTime = createAction<Time>('settings/removeNotificationTime')

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
      if (!state.nextNotifDateTime || state.nextNotifDateTime < new Date()) {
        newState.rocks = []
        newState.nextNotifDateTime = getNextTime(state.notifTimes)
      }
      newState.rocks = newState.rocks.concat(action.payload)
      return newState
    })
    .addCase(lookedAtRock, (state, action) => {
      const rock = action.payload
      const newState = Object.assign({}, state)
      delete newState[rock.id];
      return {...state, rocks: state.rocks.filter(rock => rock.id !== action.payload.id)}
    })
    .addCase(setNotificationTime, (state, action) => {
      const newTime = action.payload
      const newNotifTimes = {...state.notifTimes, [`${newTime.hours}:${newTime.minutes}`]: newTime}
      const newState = Object.assign({}, state)
      newState.notifTimes = newNotifTimes
      newState.nextNotifDateTime = getNextTime(newNotifTimes)
      return newState
    })
    .addCase(removeNotificationTime, (state, action) => {
      const toRemove = action.payload
      const newNotifTimes = Object.assign({}, state.notifTimes)
      delete newNotifTimes[`${toRemove.hours}:${toRemove.minutes}`]
      
      const newState = Object.assign({}, state)
      newState.notifTimes = newNotifTimes
      newState.nextNotifDateTime = getNextTime(newNotifTimes)
      return newState
    })
})

export const getNextTime = (notifTimes: {[str: string]: Time}) => {
  const times = Object.values(notifTimes).filter(time => !time.disabled)
  if (times.length === 0) { return null }

  const currentTime = new Date()
  const currentMinutes = currentTime.getMinutes() + currentTime.getHours() * 60

  const minuteTimers = times.map(t => {
    let minutes = t.minutes + t.hours * 60 - currentMinutes
    if (minutes < 0) { minutes += 24 * 60 }
    return minutes
  })
  minuteTimers.sort((a, b) => a - b)

  const currentEpochMinutes = Math.floor(currentTime.getTime() / (60 * 1000))
  const nextTimeEpoch = (currentEpochMinutes + minuteTimers[0]) * 60 * 1000

  return new Date(nextTimeEpoch)
}


export default newRocksReducer;