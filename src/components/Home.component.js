import React from 'react';
import RockList from './RockList.component'
import NewRockForm from './NewRockForm.component'
import { StyleSheet, View } from 'react-native';
import Text from 'components/Text.component';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

const Home = () => {
  const uid = "fake-user-id"
  useFirestoreConnect(() => [
    {
      collection: "profiles",
      doc: uid,
    }
  ])

  const userProfile = useSelector(
    ({ firestore: { data } }) => {
      return data.profiles && data.profiles[uid]
    }
  )

  return (
    <View>
      <Text>{userProfile && userProfile.displayName}'s Rocks</Text>
      <RockList uid={uid}/>
      <NewRockForm />
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default Home;
