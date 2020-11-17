import React, { ReactElement, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import ContactName from 'components/ContactName';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { StyleSheet, View } from 'react-native';
import colors from 'styles/colors';
import Avatar from 'components/Avatar';
import { Button } from 'react-native-paper';
import { actionTypes } from 'redux-firestore'
import ScheduledPushSwitches from './ScheduledPushSwitches';
import Text from 'components/Text';
import { RadioButton } from 'react-native-paper';


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
  const userData = useSelector((state : RootState) => (state.firestore.data.userData));
  const uid = userData.id
  const canonEnableInstantRocks = userData.enableInstantRocks

  
  const [tempEnableInstantRocks, setTempEnableInstantRocks] = useState<Boolean | null>(null)
  const enableInstantRocks = tempEnableInstantRocks !== null ? tempEnableInstantRocks : canonEnableInstantRocks
  const messagingToken = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.userData.messagingToken;
    }
  )

  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  

  const setEnableInstantRocks = (val: boolean) => {
    const ref = { collection: `users`, doc: uid }
    setTempEnableInstantRocks(val)
    firestore.update(ref,{
      enableInstantRocks: val,
    }).then(() => {
      setTempEnableInstantRocks(null)
    }, (e) => {
      setTempEnableInstantRocks(null)
    });
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
      firebase.messaging().deleteToken().catch(console.log).then(firebase.logout).then(() => {
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
      <View style={styles.section}>
        <Text style={styles.title}>New rock notifications</Text>
        <RadioButton.Group onValueChange={value => setEnableInstantRocks(value === 'instant')} value={enableInstantRocks ? 'instant' : 'scheduled'}>
          <View style={{paddingLeft: 10}}>
            <RadioButton.Item 
              value="instant" 
              label="Immediate"
            />
            <RadioButton.Item
              value="scheduled"
              label="Scheduled"
            />
          </View>
        </RadioButton.Group>    
      </View>

      <View style={styles.section}>
        <Text style={{...styles.title, color: enableInstantRocks ? colors.gray60 : colors.gray20 }}>Notification times</Text>
        <View style={{paddingLeft: 10}}>
          <ScheduledPushSwitches disableAll={enableInstantRocks}/>
        </View>
      </View>
      <View style={styles.spacer}></View>
      <Button
        onPress={logout}
        style={styles.logoutButton}
      >
        Log Out
      </Button>
      <Text style={styles.versionCode}>{"1.4.3" /* nicerocksversion */}</Text>
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
    fontFamily: 'Bitter-Bold',
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
  section: {
    marginBottom: 12,
  },
})
export default DrawerContent;