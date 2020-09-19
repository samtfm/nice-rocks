import 'react-native-gesture-handler';
import React, { ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import RNFirebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/functions';
import '@react-native-firebase/auth';
import { Provider } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { createFirestoreInstance } from 'redux-firestore' // <- needed if using firestore
import AuthLoaded from 'components/AuthLoaded'
import colors from 'styles/colors';
import {store} from 'reducers/rootReducer';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Platform, UIManager } from 'react-native';
import { navigationRef, isReadyRef } from './RootNavigation';
import ShareStack from 'nav/ShareStack';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  fonts: { 
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'Bitter-Regular',
      fontWeight: 'normal' as const,
    },
  },
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.blue,
  },
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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

//TODO: replace above with something like this:
// const initialState: RootState = {
//   firestore: {
//     data: {
//     },
//     errors: {},
//     listenerers: {},
//     ordered: {},
//     queries: {},
//     status: {},
//   },
// }


const rrfProps = {
 firebase: RNFirebase,
 config: rrfConfig,
 dispatch: store.dispatch,
 createFirestoreInstance, // <- needed if using firestore
 // allowMultipleListeners: true,
}


const Share = (): ReactElement => {
  React.useLayoutEffect(() => {
    return () => {
      isReadyRef.current = false
    };
  }, []);
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <PaperProvider theme={theme}>
          <AuthLoaded>
            <NavigationContainer ref={navigationRef} onReady={() => {isReadyRef.current = true;}}>
              <ShareStack />
            </NavigationContainer>
          </AuthLoaded>
        </PaperProvider>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default Share;
