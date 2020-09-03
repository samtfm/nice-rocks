import React, { ReactElement } from 'react';
import RockList from './RockList'
import { StyleSheet, ScrollView } from 'react-native';
import Text from 'components/Text';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import colors from 'styles/colors';
import { RootState } from 'reducers/rootReducer';

const ReceivedRocks = (): ReactElement => {
  const uid = useSelector((state : RootState) => (state.firestore.data.userData.id));
  const collectionPath = `profiles/${uid}/rocks`
  useFirestoreConnect(() => [{
    collection: collectionPath,
    where: ['response', '==', null],
    orderBy: ["timestamp", "desc"],
    storeAs: 'receivedRocks',
  }])
  const rocks = useSelector(
    ({ firestore }: RootState) => {
      return firestore.ordered['receivedRocks']
    }
  )

  return (
    <ScrollView style={styles.main}>
      <Text style={styles.title}>Received</Text>
      {rocks && <RockList rocks={rocks} avatarIdKey={"fromUserId"}/>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  title: {
    color: colors.gray40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  groupHeader: {
    color: colors.gray40,
  },
  listGroup: {
    marginLeft: 16,
    marginBottom: 10,
  },
});

export default ReceivedRocks;
