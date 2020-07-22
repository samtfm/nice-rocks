import React from 'react';
import RockList from '../components/RockList.component'
import NewRockForm from '../components/NewRockForm.component'
import { StyleSheet, Text, ScrollView, Button } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

const HomeScreen = ({ navigation }) => {
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
      <Button
        title="+"
        onPress={() =>
          navigation.navigate('ComposeRock')
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default HomeScreen;
