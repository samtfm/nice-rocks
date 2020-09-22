import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native'

import { MainApp, ShareApp } from './src/app';

import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import RNFirebase from '@react-native-firebase/app';

const db = firestore();

if (__DEV__) {
  // set the host property to connect to the emulator
  // set these before any read/write operations occur to ensure it doesn't affect your Cloud Firestore data!
  db.settings({ host: 'localhost:8080',  ssl: false });
  RNFirebase.functions().useFunctionsEmulator("http://localhost:5001")
}



// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!');
});


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);
AppRegistry.registerComponent('share', () => ShareApp)
AppRegistry.registerComponent('main', () => MainApp)