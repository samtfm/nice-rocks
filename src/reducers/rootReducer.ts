import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { firebaseReducer, FirestoreReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore' // <- needed if using firestore
import { Reducer } from 'redux';
import newRocksReducer from './newRocksReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer as Reducer<FirestoreReducer.Reducer>,
  newRocks: newRocksReducer,
  settings: settingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['newRocks', 'settings'],
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer);
export const persistor = persistStore(store);
