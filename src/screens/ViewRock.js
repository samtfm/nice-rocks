import React from 'react';
import RockDetails from 'components/RockDetails.component'
import { StyleSheet, ScrollView, View } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

const ViewRock = ({ route }) => {
  const { rockId, toUserId } = route.params
  const collectionPath = `profiles/${toUserId}/rocks`
  useFirestoreConnect(() => [{collection: collectionPath, doc: rockId, storeAs: `profiles/${toUserId}/rocks/${rockId}`}])
  const rock = useSelector(
    ({ firestore: { data } }) => {
      return data[`profiles/${toUserId}/rocks/${rockId}`]
    },
  )

  return (
    <View style={{flex:1, padding: 10}}>
      <ScrollView >
        {rock && <RockDetails {...rock} />}
      </ScrollView>
    </View>
  );
}

export default ViewRock;
