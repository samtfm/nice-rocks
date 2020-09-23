import { createAction, createReducer } from '@reduxjs/toolkit'

interface Time {
  hours: number,
  minutes: number,
}
interface SettingsState {
  notificationTimes: {[str: string]: Time}, // str in format `hours:minutes`
  disableAll: boolean,
  enableInstantRocks: boolean,  
}
interface SimpleSettingsUpdate{
  disableAll: boolean,
  enableInstantRocks: boolean,  
}


export const addNotificationTime = createAction<Time>('settings/addNotificationTime')
export const removeNotificationTime = createAction<Time>('settings/removeNotificationTime')
export const setSettings = createAction<SimpleSettingsUpdate>('settings/setSettings')

const initialState: SettingsState = {
  notificationTimes: {},
  disableAll: false,
  enableInstantRocks: false,
}

const settingsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addNotificationTime, (state, action) => {
      const { notificationTimes } = state
      const newTime = action.payload
      const newNotificationTimes = {...notificationTimes, [`${newTime.hours}:${newTime.minutes}`]: newTime}
      return {...state, notificationTimes: newNotificationTimes}
    })
    .addCase(removeNotificationTime, (state, action) => {
      const { notificationTimes } = state
      const toRemove = action.payload
      const newNotificationTimes = Object.assign({}, notificationTimes)
      delete newNotificationTimes[`${toRemove.hours}:${toRemove.minutes}`]
      return {...state, notificationTimes: newNotificationTimes}
    })
    .addCase(setSettings, (state, action) => {
      const newSettings = action.payload;
      return {...state, ...newSettings}
    })
})


export default settingsReducer;