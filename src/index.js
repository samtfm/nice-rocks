import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import rootReducer from './reducers/rootReducer';
import RNFirebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import { createStore, compose } from 'redux'
import { ReactReduxFirebaseProvider, firebaseReducer } from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore' // <- needed if using firestore

// Temporary test code
import RockPreview from './components/RockPreview.component'
const fakeRock = {
  title: "New Cool Thing",
  url: "zombo.com",
  note: "check this out!",
  timestamp: 1594521172,
}
//

const fbConfig = {
  apiKey: "AIzaSyCyjvCW1nT4qQszuOf0N42Umw3wMWh6SYQ",
  databaseURL: "https://nice-rocks.firebaseio.com",
  storageBucket: "nice-rocks.appspot.com",
}

// react-redux-firebase config
const rrfConfig = {
 userProfile: 'users',
 useFirestoreForProfile: true,// Firestore for Profile instead of Realtime DB
}

// Initialize firebase instance
RNFirebase.initializeApp(fbConfig)

// Initialize other services on firebase instance
RNFirebase.firestore() // <- needed if using firestore
// firebase.functions() // <- needed if using httpsCallable

// Create store with reducers and initial state
const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfProps = {
 firebase: RNFirebase,
 config: rrfConfig,
 dispatch: store.dispatch,
 createFirestoreInstance, // <- needed if using firestore
}

export default App = () => {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <RockPreview {...fakeRock} />
        </View>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
