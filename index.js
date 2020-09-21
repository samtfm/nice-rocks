import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native'

import { MainApp, ShareApp } from './src/app';

import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import RNFirebase from '@react-native-firebase/app';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
var PushNotification = require("react-native-push-notification");

const db = firestore();

if (__DEV__) {
  // set the host property to connect to the emulator
  // set these before any read/write operations occur to ensure it doesn't affect your Cloud Firestore data!
  db.settings({ host: 'localhost:8080',  ssl: false });
  RNFirebase.functions().useFunctionsEmulator("http://localhost:5001")
}

const NEW_ROCKS_PUSH_ID = '123456789';
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const { data } = remoteMessage;
  if (data.type === 'new-rock') {
    const { fromDisplayName, profileId, rockId, rockTitle } = data
    
    // clear existing new-rocks thing
    PushNotification.cancelLocalNotifications({id: NEW_ROCKS_PUSH_ID});
    
    // reschedule new-rocks push
    PushNotification.localNotificationSchedule({
      title: fromDisplayName, // "New rocks to explore!",
      message: rockTitle,
      date: new Date(Date.now() + 2 * 1000), // in 2 seconds
      id: NEW_ROCKS_PUSH_ID,
      data: {
        type: 'new-rock', // 'new-rocks',
        profileId,
        rockId,
      },
      allowWhileIdle: true,
    })
  }
  console.log('Message handled in the background!');
});


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);
AppRegistry.registerComponent('share', () => ShareApp)
AppRegistry.registerComponent('main', () => MainApp)