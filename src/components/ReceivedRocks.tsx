import React from 'react';
import RockList from './RockList'
import { StyleSheet, View, ScrollView } from 'react-native';
import Text from 'components/Text';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import ContactName from './ContactName';
import colors from 'styles/colors';
import { RootState } from 'reducers/rootReducer';

interface RockGroup {
  attr: string
  rocks: Array<any>
}  

const groupRocksByAttr = (rocks : Array<any>, attr: string): Array<RockGroup> => {
  const userGroupsMap = {}
  rocks.forEach(rock => {
    if (!userGroupsMap[rock[attr]]) {
      userGroupsMap[rock[attr]] = {
        attr: rock[attr],
        rocks: [],
      }
    }
    userGroupsMap[rock[attr]].rocks.push(rock)
  })
  return Object.values(userGroupsMap)
}

const ReceivedRocks = () => {
  const uid = useSelector((state : RootState) => (state.firestore.data.userData.id));
  const collectionPath = `profiles/${uid}/rocks`
  useFirestoreConnect(() => [ {collection: collectionPath, orderBy: ["timestamp", "desc"]} ])
  const rocks = useSelector(
    ({ firestore }: RootState) => {
      return firestore.ordered[collectionPath]
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
  groupHeader: {
    color: colors.gray40,
  },
  listGroup: {
    marginLeft: 16,
    marginBottom: 10,
  },
});

export default ReceivedRocks;
