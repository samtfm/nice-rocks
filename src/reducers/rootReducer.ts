import { combineReducers, createStore } from 'redux';
import { firebaseReducer, FirestoreReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore' // <- needed if using firestore
import { Reducer } from 'redux';
import newRocksReducer from './newRocks';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer as Reducer<FirestoreReducer.Reducer>,
  newRocks: newRocksReducer,
  settings: settingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;

export const store = createStore(rootReducer, {})
