import PushNotificationIOS from "@react-native-community/push-notification-ios";
var PushNotification = require("react-native-push-notification");
import { Alert, Platform } from "react-native";
import { handleIncomingDataPush } from "scheduledPush";
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from 'RootNavigation';
import { store } from "reducers/rootReducer";


export const initNotifHandlers = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    const { data, notification } = remoteMessage;
    if (!notification) {
      handleIncomingDataPush(store.dispatch, data)
    }
  });
  
  PushNotification.configure({
    onNotification: function (notification: any) {
      // FCM-DATA-ONLY: receive foreground
      if (notification.foreground && !notification.message) {  // received data notif while open
        handleIncomingDataPush(store.dispatch, notification.data)
      }
  
      // FCM-NOTIF: receive foreground
      if (notification.foreground && notification.message && !notification.data.local) {
        alertFromNotif(notification);
      }
  
      // LOCAL-NOTIF: open ()
      if (notification.data.local) {
        // check for message to avoid weirdly triggering on android local message recieved in background
        if (Platform.OS === 'android' && !notification.message) { return }
        
        if (notification.data.type === "new-rock") {
          const {profileId, rockId} = notification.data
          openRock(profileId, rockId)
        } else if (notification.data.type === "new-rocks") {
          RootNavigation.navigate("Received", {})
        }
      }

      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
  })
}

const alertFromNotif = (notif: any) => {
  const { title, message, data: {rockId, profileId} } = notif
  Alert.alert(
    title,
    message,
    [
      { text: 'Dismiss'},
      {
        text: 'View',
        onPress: () => {
          if (rockId && profileId) {
            openRock(profileId,  rockId)
          }
        },
      },
    ]
  );
}

const openRock = (profileId: string, rockId: string) => {
  RootNavigation.navigate(
    'ViewRock',
    { rockId: rockId, toUserId: profileId },
  ) 
}