import React from 'react';
import RockPreview from './RockPreview'
import RockList from './RockList'
import { StyleSheet, View, ScrollView } from 'react-native';
import Text from 'components/Text';
import { relativeTimeFromEpoch } from 'util/time';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import ContactName from './ContactName';
import colors from 'styles/colors';

const groupRocksByAttr = (rocks, attr) => {
  const userGroupsMap = {}
  rocks.forEach(rock => {
    if (!userGroupsMap[rock[attr]]) {
      userGroupsMap[rock[attr]] = {
        [attr]: rock[attr],
        rocks: [],
      }
    }
    userGroupsMap[rock[attr]].rocks.push(rock)
  })
  return Object.values(userGroupsMap)
}

const ReceivedRocks = () => {
  const {uid} = useSelector(state => state.firebase.auth)
  const collectionPath = `profiles/${uid}/rocks`
  useFirestoreConnect(() => [ {collection: collectionPath, orderBy: ["timestamp", "desc"]} ])
  const rocks = useSelector(
    ({ firestore }) => {
      return firestore.ordered[collectionPath]
    }
  )

  const groupedRocks = rocks ? groupRocksByAttr(rocks, "fromUserId") : []
  return (
    <ScrollView style={styles.main}>
      <Text style={styles.title}>Received</Text>
      {groupedRocks.map(group => (
        <View key={group.fromUserId}>
          <Text style={styles.groupHeader}>
            <ContactName id={group.fromUserId} />
          </Text>
          <View style={styles.listGroup}>
            <RockList rocks={group.rocks} avatarIdKey={"fromUserId"}/>
          </View>
        </View>
      ))}
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