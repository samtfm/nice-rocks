import React from 'react';
import RockList from './RockList.component'
import { StyleSheet, Text, View } from 'react-native';
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
      return data.profiles[uid]
    }
  )

  return (
    <View>
      <Text>{userProfile.displayName}'s Rocks</Text>
      <RockList uid={uid}/>
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default Home;
