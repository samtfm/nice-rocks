import React, { ReactElement } from 'react';
import RockList from './RockList'
import { StyleSheet, View, ScrollView} from 'react-native';
import Text from 'components/Text';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import colors from 'styles/colors';
import { RootState } from 'reducers/rootReducer';

const ArchivedRocks = (): ReactElement => {
  const uid = useSelector((state : RootState) => (state.firestore.data.userData.id));
  const collectionPath = `profiles/${uid}/rocks`
  useFirestoreConnect(() => [ {
    collection: collectionPath,
    orderBy: [
      ["timestamp", "desc"],
      ["response.timestamp", "desc"],
    ],
    storeAs: 'archivedRocks',
  }]);

  const rocks = useSelector(
    ({ firestore }: RootState) => {
      return firestore.ordered['archivedRocks'];
    }
  ) || []

  return (
    <View style={styles.main}>
      <ScrollView>
        <Text style={styles.title}>Archive</Text>
        <RockList rocks={rocks} avatarIdKey={"fromUserId"}/>
      </ScrollView>
    </View>
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
});

export default ArchivedRocks;
