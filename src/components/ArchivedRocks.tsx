import React, { ReactElement, useState } from 'react';
import RockList from './RockList'
import { StyleSheet, View, ScrollView} from 'react-native';
import Text from 'components/Text';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import colors from 'styles/colors';
import { RootState } from 'reducers/rootReducer';
import { Button } from 'react-native-paper';

const ITEMS_PER_PAGE = 10
const ArchivedRocks = (): ReactElement => {
  const uid = useSelector((state : RootState) => (state.firestore.data.userData.id));
  const collectionPath = `profiles/${uid}/rocks`
  const [limit, setLimit] = useState(ITEMS_PER_PAGE)

  useFirestoreConnect(() => [ {
    collection: collectionPath,
    orderBy: [
      ["timestamp", "desc"],
      ["response.timestamp", "desc"],
    ],
    storeAs: 'archivedRocks',
    limit: limit+1,
  }]);

  const rocks = useSelector(
    ({ firestore }: RootState) => {
      return firestore.ordered['archivedRocks'];
    }
  ) || []

  const rocksToShow = rocks.slice(0, limit)
  const showMoreButton = rocks.length == limit+1

  return (
    <View style={styles.main}>
      <ScrollView>
        <Text style={styles.title}>Archive</Text>
        <RockList rocks={rocksToShow} avatarIdKey={"fromUserId"}/>
        {showMoreButton && (
          <Button 
            style={{alignSelf: "center"}}
            mode={'outlined'}
            onPress={() => setLimit(limit+ITEMS_PER_PAGE)}
          >Load more</Button>
        )}
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
