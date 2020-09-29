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
import { persistor, store } from 'reducers/rootReducer';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Platform, UIManager } from 'react-native';
import { navigationRef, isReadyRef } from './RootNavigation';
import MainStack from 'nav/MainStack';
import IsShareExtensionContext from 'IsShareExtensionContext';
import messaging from '@react-native-firebase/messaging';
import { queueNewRock } from 'reducers/newRocksReducer';
import { PersistGate } from 'redux-persist/integration/react';
import Text from 'components/Text';
var PushNotification = require("react-native-push-notification");
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import * as RootNavigation from 'RootNavigation';

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

const rrfProps = {
 firebase: RNFirebase,
 config: rrfConfig,
 dispatch: store.dispatch,
 createFirestoreInstance, // <- needed if using firestore
 // allowMultipleListeners: true,
}

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const { data } = remoteMessage;
  if (data && data.type === 'new-rock') {
    const { fromDisplayName, profileId, rockId, rockTitle } = data
    const { enableInstantRocks } = store.getState().settings;
    if (enableInstantRocks) {
      PushNotification.localNotification({
        title: data.fromDisplayName,
        message: data.title,
        data: {
          type: 'new-rock',
          profileId: data.profileId,
          rockId: data.rockId,
        },
        allowWhileIdle: true,
      })    
    } else {
      store.dispatch(queueNewRock({toUserId: profileId, id: rockId, title: rockTitle, fromDisplayName}))
    }
  }
});

PushNotification.configure({
  onNotification: function (notification: any) {
    if (notification.data && notification.data.type) {
      if (['new-response', 'new-rock'].includes(notification.data.type)) {
        const { rockId, profileId } = notification.data
        RootNavigation.navigate(
          'ViewRock',
          { rockId: rockId, toUserId: profileId },
        )    
      }
    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
})

const App = (): ReactElement => {
  React.useLayoutEffect(() => {
    return () => {
      isReadyRef.current = false
    };
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading local settings...</Text>} persistor={persistor}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <PaperProvider theme={theme}>
          <AuthLoaded>
            <NavigationContainer ref={navigationRef} onReady={() => {isReadyRef.current = true;}}>
              <MainStack />
            </NavigationContainer>
          </AuthLoaded>
        </PaperProvider>
      </ReactReduxFirebaseProvider>
      </PersistGate>
    </Provider>
  );
}

export const MainApp = () => {
  return (
    <IsShareExtensionContext.Provider value={false}>
      <App/>
    </IsShareExtensionContext.Provider>
  );
}
export const ShareApp = () => {
  return (
    <IsShareExtensionContext.Provider value={true}>
      <App/>
    </IsShareExtensionContext.Provider>
  );
}