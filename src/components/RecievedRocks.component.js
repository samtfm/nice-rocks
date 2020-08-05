import React from 'react';
import RockPreview from './RockPreview.component'
import RockList from './RockList.component'
import { StyleSheet, Text, View } from 'react-native';
import { relativeTimeFromEpoch } from 'util/time';
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

const RecievedRocks = () => {
  const {uid} = useSelector(state => state.firebase.auth)
  useFirestoreConnect(() => [{collection: "users", doc: uid}])
  const userData = useSelector(
    ({ firestore: { data } }) => {
      return data.users && data.users[uid]
    }
  )
  const collectionPath = `profiles/${uid}/rocks`
  useFirestoreConnect(() => [{collection: collectionPath}])
  const rocks = useSelector(
    ({ firestore: { data } }) => {
      return data[collectionPath]
    }
  )

  const groupedRocks = rocks ? groupRocksByAttr(Object.values(rocks), "fromUserId") : []
  return (
    <View>
      {groupedRocks.map(group => (
        <View key={group.fromUserId}>
          <ContactName id={group.fromUserId} />
          <RockList rocks={group.rocks} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default RecievedRocks;
