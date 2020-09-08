import React, { ReactElement } from 'react';

import Avatar from 'components/Avatar';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import ContactName from 'components/ContactName';
import { Button } from 'react-native-paper';
import { useFirebase } from 'react-redux-firebase';
import { View, StyleSheet } from 'react-native';
import colors from 'styles/colors';

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
const DrawerContent = ({state, navigation, descriptors, progress}: DrawerContent): ReactElement => {
  const uid = useSelector((state : RootState) => (state.firestore.data.userData.id));
  const firebase = useFirebase();

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Avatar id={uid} size={45} />
        <ContactName style={{marginTop: 10, fontSize: 18, fontFamily: 'Bitter-Bold'}} id={uid} />

      </View>
      <Button
        onPress={firebase.logout}
        style={styles.logoutButton}
      >
        Log Out
      </Button>
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
  logoutButton: {
    marginBottom: 30,
    alignSelf: 'center',
  },
})
export default DrawerContent;