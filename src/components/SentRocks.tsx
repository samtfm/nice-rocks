import React from 'react';
import RockList from './RockList'
import { StyleSheet, View, ScrollView} from 'react-native';
import Text from 'components/Text';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import colors from 'styles/colors';
import { RootState } from 'reducers/rootReducer';

const SentRocks = () => {
  const {uid} = useSelector((state: RootState) => state.firebase.auth)

  useFirestoreConnect(() => [ {
    collectionGroup: 'rocks',
    where: ['fromUserId', '==', uid],
    orderBy: ["timestamp", "desc"],
    storeAs: 'sentRocks',
  }])

  const rocks = useSelector(
    ({ firestore }: RootState) => {
      return firestore.ordered['sentRocks'];
    }
  ) || []

  return (
    <View style={styles.main}>
      <ScrollView>
        <Text style={styles.title}>Sent</Text>
        <RockList rocks={rocks} avatarIdKey={"toUserId"}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
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

export default SentRocks;
