import { combineReducers, createStore } from 'redux';
import { firebaseReducer,  FirebaseReducer, FirestoreReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore' // <- needed if using firestore
import { Reducer } from 'redux';

interface RootState {
  firebase: FirebaseReducer.Reducer
  firestore: FirestoreReducer.Reducer 
}

const rootReducer = combineReducers<RootState>({
  firebase: firebaseReducer,
  firestore: firestoreReducer as Reducer<FirestoreReducer.Reducer>
})

export type { RootState };
export default rootReducer;

export const store = createStore(rootReducer, {})


// MAYBE TODO: no need to explicity declare the type of RootState if you write it this way:

// const rootReducer = combineReducers({
//   firebase: firebaseReducer,
//   firestore: firestoreReducer as Reducer<FirestoreReducer.Reducer>,
// })

// export type RootState = ReturnType<typeof rootReducer>

// export default rootReducer;

// export const store = createStore(rootReducer, {})
