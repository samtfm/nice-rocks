import { combineReducers } from 'redux';
import { firebaseReducer,  FirebaseReducer, FirestoreReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore' // <- needed if using firestore


interface RootState {
  firebase: FirebaseReducer.Reducer
  firestore: FirestoreReducer.Reducer 
}

const rootReducer = combineReducers<RootState>({
  firebase: firebaseReducer,
  firestore: firestoreReducer as unknown as FirestoreReducer.Reducer
})
console.log(firestoreReducer)

export type { RootState };
export default rootReducer;