import React, { ReactElement, useState } from 'react';
import RockList from 'components/RockList'
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
  );

  const rocksToShow = rocks ? rocks.slice(0, limit) : []
  const showMoreButton = rocks && rocks.length == limit+1

  return (
    <ScrollView style={styles.main}>
      <Text style={styles.title}>Archive</Text>
      {rocks && rocks.length === 0 && (
        <Text style={styles.emptyTooltip}>
          {"Your archive is empty. Once you respond to a rock you can find it again here."}
        </Text>
      )}
      <RockList rocks={rocksToShow} avatarIdKey={"fromUserId"}/>
      <View style={{paddingBottom: 40, paddingTop: 10}}>
        {showMoreButton && (
          <Button 
            style={{alignSelf: "center"}}
            mode={'outlined'}
            color={colors.primaryDark}
            onPress={() => setLimit(limit+ITEMS_PER_PAGE)}
          >Load more</Button>
        )}
      </View>
    </ScrollView>
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
  emptyTooltip: {
    alignSelf: 'center',
    marginTop: 60,
    width: 280,
    lineHeight: 22,
    textAlign: 'center',
    color: colors.gray40,
  },

});

export default ArchivedRocks;
