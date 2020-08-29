import { combineReducers } from 'redux';
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