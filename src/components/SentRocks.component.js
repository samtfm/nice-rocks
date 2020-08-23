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
  ) || []

  return (
    <View style={{paddingLeft: 10, paddingRight: 10, paddingTop: 10}}>
      <ScrollView>
        <Text style={styles.title}>Sent Rocks</Text>
        <RockList rocks={rocks} avatarIdKey={"toUserId"}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'dimgray',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default SentRocks;
