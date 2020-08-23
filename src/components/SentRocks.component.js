import React from 'react';
import RockPreview from './RockPreview.component'
import RockList from './RockList.component'
import { StyleSheet, Text, View, ScrollView} from 'react-native';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import ContactName from './ContactName.component';


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

const SentRocks = () => {
  const {uid} = useSelector(state => state.firebase.auth)

  useFirestoreConnect(() => [ {
    collectionGroup: 'rocks',
    where: ['fromUserId', '==', uid],
    orderBy: ["timestamp", "desc"],
    storeAs: 'sentRocks',
  }])

  const rocks = useSelector(
    ({ firestore }) => {
      return firestore.ordered['sentRocks'];
    }
  )

  const groupedRocks = rocks ? groupRocksByAttr(rocks, 'toUserId') : []
  return (
    <ScrollView>
      {groupedRocks.map(group => (
        <View key={group.toUserId}>
          <Text>To: <ContactName id={group.toUserId} /></Text>
          <RockList rocks={group.rocks} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default SentRocks;
