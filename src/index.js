import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { StyleSheet, Text, View } from 'react-native';
import rootReducer from 'reducers/rootReducer';
import RNFirebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux'
import { createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import { ReactReduxFirebaseProvider, firebaseReducer, isEmpty} from 'react-redux-firebase'
import { createFirestoreInstance } from 'redux-firestore' // <- needed if using firestore
import Home from 'screens/Home'
import ComposeRock from 'screens/ComposeRock'
import Login from 'screens/Login'
import ViewRock from 'screens/ViewRock'
import AuthLoaded from 'components/AuthLoaded.component'
import ContactSelector from 'components/ContactSelector.component'

// react-redux-firebase config
const rrfConfig = {
 userProfile: 'users',
 useFirestoreForProfile: true,// Firestore for Profile instead of Realtime DB
}

// Initialize other services on firebase instance
RNFirebase.firestore() // <- needed if using firestore
RNFirebase.functions() // <- needed if using httpsCallable

// Create store with reducers and initial state
const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfProps = {
 firebase: RNFirebase,
 config: rrfConfig,
 dispatch: store.dispatch,
 createFirestoreInstance, // <- needed if using firestore
 // allowMultipleListeners: true,
}

const MainStack = createStackNavigator();
const ModalStack = createStackNavigator();

const MainStackScreen = () => {
  const auth = useSelector(state => state.firebase.auth)
  return isEmpty(auth) ? (
    <MainStack.Navigator initialRouteName="Login">
      <MainStack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Login' }}
      />
    </MainStack.Navigator>
  ) : (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen
        name="Home"
        component={Home}
        options={{ title: 'My Collection' }}
      />
      <MainStack.Screen
        name="ComposeRock"
        component={ComposeRock}
        options={{ title: 'Send a new Rock' }}
      />
      <MainStack.Screen
        name="ViewRock"
        component={ViewRock}
        options={{ title: 'View Rock' }}
      />
    </MainStack.Navigator>
  );
}


const App = () => {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthLoaded>
          <NavigationContainer>
            <ModalStack.Navigator mode="modal">
              <ModalStack.Screen
                name="Main"
                component={MainStackScreen}
                options={{ headerShown: false }}
              />
              <ModalStack.Screen
                name="SelectContact"
                component={ContactSelector}
                options={{ title: 'Select Contact', headerBackTitle: "Cancel" }}
              />
            </ModalStack.Navigator>
          </NavigationContainer>
        </AuthLoaded>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
