import React from 'react';
import RockList from '../components/RockList.component'
import NewRockForm from '../components/NewRockForm.component'
import { StyleSheet, Text, View } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

const HomeScreen = () => {
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

export default HomeScreen;
