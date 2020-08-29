import React from 'react';
import RockDetails from 'components/RockDetails'
import { ScrollView, View } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/rootReducer';

const ViewRock = ({ route }) => {
  const { rockId, toUserId } = route.params
  const collectionPath = `profiles/${toUserId}/rocks`
  useFirestoreConnect(() => [{collection: collectionPath, doc: rockId, storeAs: `profiles/${toUserId}/rocks/${rockId}`}])
  const rock = useSelector(
    ({ firestore: { data } }: RootState) => {
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
