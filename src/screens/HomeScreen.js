import React from 'react';
import RockList from '../components/RockList.component'
import NewRockForm from '../components/NewRockForm.component'
import { StyleSheet, Text, ScrollView } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

const HomeScreen = () => {
  const {uid} = useSelector(state => state.firebase.auth)
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
    <ScrollView>
      <Text>{userProfile && userProfile.displayName}'s Rocks</Text>
      <RockList uid={uid}/>
      <NewRockForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default HomeScreen;
