
import React, { useEffect, useState, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Linking } from 'react-native';
import { useFirebase, useFirestore, useFirestoreConnect } from 'react-redux-firebase'
import messaging from '@react-native-firebase/messaging';
import { RootState } from 'reducers/rootReducer';
import * as RootNavigation from 'RootNavigation';
import * as queryString from 'query-string';

const MessagingWrapper = ({children}: {children: ReactElement}): ReactElement => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const uid = firebase.auth().currentUser.uid;
  useFirestoreConnect(() => [{ collection: "users", doc: uid, storeAs: 'userData' }])

  const userData = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.userData;
    }
  )
  const [notificationsAuthorized, setNotificationsAuthorized] = useState(false)

  const sendToken = (token: string) => {
    const ref = { collection: 'users', doc: uid }
    firestore.update(ref, {
      messagingToken: token,
    }).catch(err => console.log(err));
  }
  const ensureMessagingToken = (token: string) => {
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
    firebase.messaging().requestPermission().then((authStatus: number) => {
      setNotificationsAuthorized(
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      )
    });
  })
  
  const viewRock = (rockId: string, profileId: string) => {
    RootNavigation.navigate(
      'ViewRock',
      { rockId: rockId, toUserId: profileId },
    )
  }
  
  useEffect(() => (
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage.data && remoteMessage.data.type) {
        if (['new-response', 'new-rock'].includes(remoteMessage.data.type)) {
          const { rockId, profileId } = remoteMessage.data
          viewRock(rockId, profileId)
        }
      }
    })
  ), []);

  useEffect(() => {
    const unsubscribe = firebase.messaging().onMessage(async (remoteMessage: any) => {
      remoteMessage.notification && Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    firebase.messaging().getToken().then((token: string) => {
      ensureMessagingToken(token);
    })
  }, [userData]);

  firebase.messaging().onTokenRefresh((token: string) => {
    ensureMessagingToken(token);
  })


  const handleOpenURL = (e: {url: string}) => {
    onInitialUrl(e.url)
  }

  const onInitialUrl = (url: string | null) => {
    if (url) {
      const queryStart = url.indexOf('?')
      if (queryStart) {
        const qs = (url.slice(queryStart + 1));
        const args = queryString.parse(qs);
        if (args.shareUrl) {
          RootNavigation.navigate(
            'ComposeRock',
            { url: args.shareUrl },
          )      
        }
      }
    }
  }
  
  useEffect(() => {
    Linking.getInitialURL().then(onInitialUrl).catch(err => {
      console.warn('An error occurred', err);
    });
  
    Linking.addEventListener('url', handleOpenURL);
    return (() => {
      Linking.removeEventListener('url', handleOpenURL);
    })
  }, []);
  

 

  return <>{userData && children}</>
}

export default MessagingWrapper;
