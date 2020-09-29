import React, { ReactElement, useEffect } from 'react';
import RockDetails from 'components/RockDetails'
import { ScrollView, View } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'reducers/rootReducer';
import colors from 'styles/colors';
import { lookedAtRock } from 'reducers/newRocksReducer';

interface ViewRock{
  route: any
}

const ViewRock = ({ route }: ViewRock): ReactElement => {
  const { rockId, toUserId } = route.params
  const collectionPath = `profiles/${toUserId}/rocks`
  useFirestoreConnect(() => [{collection: collectionPath, doc: rockId, storeAs: `profiles/${toUserId}/rocks/${rockId}`}])
  const dispatch = useDispatch()
  
  // remove rock from scheduled push
  useEffect(() => {
    dispatch(lookedAtRock({
      id: rockId,
      toUserId: toUserId,
    }))
  }, [rockId, toUserId]);

  const rock = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data[`profiles/${toUserId}/rocks/${rockId}`]
    },
  )

  return (
    <View style={{flex:1, paddingLeft: 10, paddingRight: 10, paddingTop: 10, backgroundColor: colors.beige}}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        {rock && <RockDetails {...rock} />}
      </ScrollView>
    </View>
  );
}

export default ViewRock;
