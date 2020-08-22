
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useFirebase, useFirestore, useFirestoreConnect } from 'react-redux-firebase'

const MessagingWrapper = ({children}) => {
  const { uid } = useSelector(state => state.firebase.auth);

  const firebase = useFirebase();
  const firestore = useFirestore();
  const userData = useSelector(
    ({ firestore: { data } }) => {
      return data.users && data.users[uid]
    }
  )

  const sendToken = (token) => {
    firestore.collection("users").doc(uid).update({
      messagingToken: token,
    }).catch(err => console.log(err));
  }
  const ensureMessagingToken = (token) => {
    if (!userData) { return }
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

  useFirestoreConnect(() => [{ collection: "users", doc: uid }])

  // const enabled =
  //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //
  // if (enabled) {
  //   console.log('Authorization status:', authStatus);
  // }
  //

  useEffect(() => {
    firebase.messaging().requestPermission();
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
