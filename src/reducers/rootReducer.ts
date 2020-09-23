import { combineReducers, createStore } from 'redux';
import { firebaseReducer, FirestoreReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore' // <- needed if using firestore
import { Reducer } from 'redux';
import notificationsReducer from './notificationsReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer as Reducer<FirestoreReducer.Reducer>,
  notifications: notificationsReducer,
  settings: settingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;

export const store = createStore(rootReducer, {})
