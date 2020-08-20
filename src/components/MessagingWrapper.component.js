
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

  const updateMessagingToken = (token) => {
    if (userData && userData.messagingToken != token) {
      firestore.collection("users").doc(uid).update({
        messagingToken: token,
      }).catch(err => console.log(err));
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
      updateMessagingToken(token);
    })
  }, [userData]);

  firebase.messaging().onTokenRefresh(token => {
    updateMessagingToken(token);
  })
  return <>{children}</>
}

export default MessagingWrapper;
