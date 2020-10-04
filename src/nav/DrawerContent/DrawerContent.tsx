import React, { ReactElement } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import ContactName from 'components/ContactName';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { StyleSheet, View } from 'react-native';
import colors from 'styles/colors';
import Avatar from 'components/Avatar';
import { Button, Switch } from 'react-native-paper';
import { actionTypes } from 'redux-firestore'
import ScheduledPushSwitches from './ScheduledPushSwitches';
import Text from 'components/Text';
import { setSettings } from 'reducers/settingsReducer';


interface DrawerContent{
  // The navigation state of the navigator, state.routes contains list of all routes
  state: any
  // The navigation object for the navigator.
  navigation: any
  // An descriptor object containing options for the drawer screens. The options can be accessed at descriptors[route.key].options.
  descriptors: any 
  // Reanimated Node that represents the animated position of the drawer (0 is closed; 1 is open).
  progress: any,
}
const DrawerContent = ({}: DrawerContent): ReactElement => {
  const uid = useSelector((state : RootState) => (state.firestore.data.userData.id));
  
  const messagingToken = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.userData.messagingToken;
    }
  )

  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  
  const { enableInstantRocks } = useSelector((state: RootState) => state.settings)

  const setNotifMode = (val: boolean) => {
    dispatch(setSettings({enableInstantRocks: val}))
  }
  const toggleNotifMode = () => {
    setNotifMode(!enableInstantRocks)
  }

  const clearToken = () => {
    const ref = { collection: 'users', doc: uid }
    return firestore.update(ref, {
      messagingToken: null,
    })
  }

  const logout = () => {
    firebase.messaging().getToken().then((myToken: string) => {
      const shouldClearTokenAfter = myToken == messagingToken
      firebase.messaging().deleteToken().then(firebase.logout).then(() => {
        dispatch({ type: actionTypes.CLEAR_DATA })
        if (shouldClearTokenAfter) {
          clearToken()
        }
      })
    })
  }

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Avatar id={uid} size={45} />
        <ContactName style={{marginTop: 10, fontSize: 18, fontFamily: 'Bitter-Bold'}} id={uid} />

      </View>

      <Text style={{...styles.title, color: enableInstantRocks ? colors.gray60 : colors.gray20 }}>Notification times</Text>
      <View style={{paddingLeft: 10}}>
        <ScheduledPushSwitches disableAll={enableInstantRocks}/>
      </View>

      <View style={styles.notifModeToggle}>
        <Text style={{flex: 1}}>{"Instant new rock notifications"}</Text>
        <Switch value={enableInstantRocks} onValueChange={toggleNotifMode}/>
      </View>
      
      <View style={styles.spacer}></View>
      <Button
        onPress={logout}
        style={styles.logoutButton}
      >
        Log Out
      </Button>
      <Text style={styles.versionCode}>{"1.4.2"}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  main: {
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    marginBottom: 20,
    backgroundColor: colors.primaryLight,
    paddingLeft: 20,
    paddingRight: 6,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    paddingHorizontal: 10,
    marginBottom: 8,
    // fontSize: 12,
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    marginBottom: 30,
    alignSelf: 'center',
  },
  versionCode: {
    position: 'absolute',
    left: 4,
    bottom: 4,
    fontSize: 10,
  },
  notifModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 20,
  },
})
export default DrawerContent;