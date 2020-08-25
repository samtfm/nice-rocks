
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { StyleSheet, View, Alert } from 'react-native';
import Text from 'components/Text.component';
import { useFirebase, useFirestore, useFirestoreConnect } from 'react-redux-firebase'
import messaging from '@react-native-firebase/messaging';

const MessagingWrapper = ({children}) => {
  const firebase = useFirebase();
  const firestore = useFirestore();

  const { uid } = useSelector(state => state.firebase.auth);

  useFirestoreConnect(() => [{ collection: "users", doc: uid, storeAs: 'userData' }])

  const userData = useSelector(
    ({ firestore: { data } }) => {
      return data.userData;
    }
  )

  const [notificationsAuthorized, setNotificationsAuthorized] = useState(false)

  const sendToken = (token) => {
    firestore.collection("users").doc(uid).update({
      messagingToken: token,
    }).catch(err => console.log(err));
  }
  const ensureMessagingToken = (token) => {
    if (!userData || !notificationsAuthorized) { return }

    if (!userData.messagingToken) {
      sendToken(token)
    } else if (userData.messagingToken != token) {
      Alert.alert(
        "Push notification connection is out of date",
        "Would you like to receive push notifications on this device?",
        [
          {
            text: "No",
            style: "cancel"
          },
          { text: "Yes", onPress: () => (sendToken(token)) }
        ],
        { cancelable: false }
      );
    }
  }

  useEffect(() => {
    firebase.messaging().requestPermission().then(authStatus => {
      setNotificationsAuthorized(
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      )
    });
  })

  useEffect(() => {
    const unsubscribe = firebase.messaging().onMessage(async remoteMessage => {
      remoteMessage.notification && Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    firebase.messaging().getToken().then(token => {
      ensureMessagingToken(token);
    })
  }, [userData]);

  firebase.messaging().onTokenRefresh(token => {
    ensureMessagingToken(token);
  })
  return <>{children}</>
}

export default MessagingWrapper;
