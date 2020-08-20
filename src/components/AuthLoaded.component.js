
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useFirebase, useFirestore, useFirestoreConnect } from 'react-redux-firebase'

const MessagingWrapper = ({uid, children}) => {

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
  }, []);

  firebase.messaging().onTokenRefresh(token => {
    updateMessagingToken(token);
  })
  return <>{children}</>
}

const AuthLoaded = ({ children }) => {
  const auth = useSelector(state => state.firebase.auth);

  if (!isLoaded(auth)) {
    return <Text>splash screen...</Text>;
  }

  return <MessagingWrapper uid={auth.uid}>{children}</MessagingWrapper>
}

export default AuthLoaded;
