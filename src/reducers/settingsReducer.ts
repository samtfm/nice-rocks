import { createAction, createReducer } from '@reduxjs/toolkit'

interface SettingsState {
  disableAll: boolean,
  enableInstantRocks: boolean,  
}
interface SimpleSettingsUpdate{
  disableAll?: boolean,
  enableInstantRocks?: boolean,  
}


export const setSettings = createAction<SimpleSettingsUpdate>('settings/setSettings')

const initialState: SettingsState = {
  disableAll: false,
  enableInstantRocks: false,
}

const settingsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setSettings, (state, action) => {
      const newSettings = action.payload;
      return {...state, ...newSettings}
    })
})

export default settingsReducer;