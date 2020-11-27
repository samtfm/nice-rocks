import { combineReducers, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { firebaseReducer, FirestoreReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore' // <- needed if using firestore
import { Reducer } from 'redux';
import newRocksReducer from './newRocksReducer';
import { setOrUpdateScheduledPush } from 'scheduledPush';

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer as Reducer<FirestoreReducer.Reducer>,
  newRocks: newRocksReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['newRocks'],
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const pReducer = persistReducer<RootState>(persistConfig, rootReducer);

function updateScheduledPush({getState}: any) {
  return (next: any) => (action: any) => {
    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action)
    if ([
      'newRocks/queueNewRock',
      'newRocks/lookedAtRock',
      'newRocks/setNotificationTime',
      'newRocks/removeNotificationTime',
    ].includes(action.type)){
      setOrUpdateScheduledPush(getState());
    }
    
    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}

export const store = createStore(pReducer, applyMiddleware(updateScheduledPush));
export const persistor = persistStore(store);
